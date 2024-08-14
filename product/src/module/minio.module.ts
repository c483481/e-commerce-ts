import { Client, S3Error } from "minio";

interface Config {
    endPoint: string;
    port: number;
    useSSL: boolean;
    accessKey: string;
    secretKey: string;
}

class MinioModule {
    private client!: Client;

    private setListBucket = new Set<string>();

    init = async (config: Config, listBucket: string[]): Promise<void> => {
        console.log("[*] inititate bucket");

        await this.connectToMinio(config);

        await this.createBucketList(listBucket);
    };

    uploadImage = async (bucket: string, name: string, data: Buffer): Promise<boolean> => {
        if (this.setListBucket.has(bucket)) {
            await this.client.putObject(bucket, name, data);
            return true;
        }

        console.log(`[!] unkown bucket name "${bucket}"`);
        return false;
    };

    getImage = async (bucket: string, name: string): Promise<Buffer | null> => {
        try {
            if (!this.setListBucket.has(bucket)) {
                console.log(`[!] unkown bucket name "${bucket}"`);
                return null;
            }
            const stream = await this.client.getObject(bucket, name);

            const data = [];
            for await (const chunk of stream) {
                data.push(chunk);
            }

            return Buffer.concat(data);
        } catch (error) {
            if (error instanceof S3Error && error.code === "NoSuchKey") {
                console.log(`[!] unkown Image "${name}"`);
            } else {
                console.log(error);
            }
            return null;
        }
    };

    deleteImage = async (bucket: string, name: string): Promise<boolean> => {
        try {
            if (!this.setListBucket.has(bucket)) {
                console.log(`[!] unkown bucket name "${bucket}"`);
                return false;
            }

            await this.client.removeObject(bucket, name);

            return true;
        } catch (error) {
            if (error instanceof S3Error && error.code === "NoSuchKey") {
                console.log(`[!] unkown image ${name}`);
            } else {
                console.log(error);
            }
            return false;
        }
    };

    private connectToMinio = async (config: Config): Promise<void> => {
        try {
            this.client = new Client({
                endPoint: config.endPoint,
                port: config.port,
                useSSL: config.useSSL,
                accessKey: config.accessKey,
                secretKey: config.secretKey,
            });
        } catch (error) {
            console.error("[!] An error occurred while connect minio:", error);
            console.log("[*] try again in 2 seconds");
            await this.delay();
            return this.connectToMinio(config);
        }
    };

    private createBucketList = async (bucketList: string[]): Promise<void> => {
        for (const bucket of bucketList) {
            if (this.setListBucket.has(bucket)) {
                continue;
            }

            const bucketIsExist = await this.client.bucketExists(bucket);

            if (!bucketIsExist) {
                await this.client.makeBucket(bucket, "us-east-1");
            }

            this.setListBucket.add(bucket);
            console.log(`[*] initiate bucket: "${bucket}"`);
        }
    };

    private delay(): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, 2000));
    }
}

export const minioModule = new MinioModule();
