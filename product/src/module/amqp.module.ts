import amqplib from "amqplib";

class Amqp {
    private amqpCon!: amqplib.Connection;
    private amqpChannel!: amqplib.Channel;
    private failedMessage: { queue: string; message: string }[] = [];

    private readonly setNameQueue = new Set<string>();
    private readonly setTopicQueue = new Set<string>();

    init = async (amqpUri: string): Promise<void> => {
        await this.createConnection(amqpUri);

        this.amqpChannel.on("drain", () => {
            let successIndex = 0;
            for (const payload of this.failedMessage) {
                const { queue, message } = payload;

                const sent = this.sendFailedMessage(queue, message);

                if (!sent) {
                    console.log("[!] Buffer full, need to wait");
                    break;
                }
                console.log(`[*] success to send data to queue: "${queue}"`);
                successIndex++;
            }

            this.failedMessage = this.failedMessage.slice(successIndex, this.failedMessage.length);
        });
    };

    sendMessage = async (queue: string, message: unknown): Promise<void> => {
        if (message === null || message === undefined) {
            console.log("[!] Message cannot be null");
            return;
        }

        if (!this.setTopicQueue.has(queue)) {
            await this.amqpChannel.assertQueue(queue, { durable: true });
            this.setTopicQueue.add(queue);
        }

        let buffer!: Buffer;

        switch (typeof message) {
            case "string": {
                buffer = Buffer.from(message);
                break;
            }
            case "object": {
                buffer = Buffer.from(JSON.stringify(message));
                break;
            }
            case "number":
            case "bigint":
            case "boolean":
            case "symbol":
                buffer = Buffer.from(message.toString());
                break;
            default: {
                console.log("[!] Unsupported message type");
                return;
            }
        }
        const sent = this.amqpChannel.sendToQueue(queue, buffer);

        if (sent) {
            console.log(`[*] success to send data to queue: "${queue}"`);
            return;
        }

        console.log("[!] Buffer full, need to wait");
        this.failedMessage.push({ queue, message: buffer.toString() });
    };

    createConsumer = async <T>(
        queue: string,
        services: (payload: T) => Promise<unknown> | unknown,
        validate?: (payload: T) => boolean
    ): Promise<void> => {
        if (this.setNameQueue.has(queue)) {
            console.log(`[!] Duplicate consumer queue: "${queue}"`);
            return;
        }
        this.setNameQueue.add(queue);

        await this.amqpChannel.assertQueue(queue, { durable: true });
        this.setTopicQueue.add(queue);

        console.log(`[*] initiate queue ${queue}`);

        this.amqpChannel.consume(
            queue,
            async (msg: amqplib.ConsumeMessage | null) => {
                if (!msg) {
                    console.log("[!] Retrive null message");
                    return;
                }

                try {
                    const start = performance.now();

                    const content = msg.content.toString();

                    const payload = JSON.parse(content) as T;

                    if (validate && !validate(payload)) {
                        console.log(`[!] Invalid message format for queue "${queue}". Rejecting message.`);
                        this.amqpChannel.reject(msg, false); // Reject invalid messages without requeue
                        return;
                    }
                    await services(payload);

                    this.amqpChannel.ack(msg);

                    const end = performance.now();

                    console.log(`[*] proccess "${queue}" (${Math.round(end - start)}ms)`);
                } catch (error) {
                    console.log(`[!] error while proccess message. error: ${error}`);
                    // Nack with requeue, as the error might be due to server issues
                    this.amqpChannel.nack(msg, false, true);
                }
            },
            { noAck: false }
        );
    };

    close = async (): Promise<void> => {
        if (this.amqpChannel) {
            await this.amqpChannel.close();
        }
        if (this.amqpCon) {
            await this.amqpCon.close();
        }
    };

    private sendFailedMessage = (queue: string, message: string): boolean => {
        return this.amqpChannel.sendToQueue(queue, Buffer.from(message));
    };

    private createConnection = async (uri: string): Promise<void> => {
        try {
            this.amqpCon = await amqplib.connect(uri);
            this.amqpChannel = await this.amqpCon.createChannel();

            this.amqpChannel.prefetch(1);
            console.log(`[*] Success connect to amqp: ${uri}`);
        } catch (error) {
            console.error("[!] An error connect to amqp :", error);
            console.log("[!] try again in 2 seconds");
            await this.delay();
            return this.createConnection(uri);
        }
    };

    private delay(): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, 2000));
    }
}

export const amqp = new Amqp();
