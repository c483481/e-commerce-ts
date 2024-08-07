import amqplib from "amqplib";

class Amqp {
    private amqpCon!: amqplib.Connection;
    private amqpChannel!: amqplib.Channel;
    private failedMessage: { queue: string; message: string }[] = [];

    private readonly setNameQueue = new Set();

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

    sendMessage = (queue: string, message: unknown) => {
        if (message === null || message === undefined) {
            console.log("[!] Message cannot be null");
            return;
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

    createConsumer = <T>(
        queue: string,
        services: (payload: T) => Promise<unknown> | unknown,
        validate?: (payload: T) => boolean
    ): void => {
        if (this.setNameQueue.has(queue)) {
            console.log(`[!] Duplicate consumer queue: "${queue}"`);
            return;
        }
        this.setNameQueue.add(queue);

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
            throw new Error(`[!] Failed to connect to no sql with uri : ${uri}`);
        }
    };
}

export const amqp = new Amqp();
