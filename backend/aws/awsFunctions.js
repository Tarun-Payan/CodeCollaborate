import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3client = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

export const getFileUrl = async (key) => {
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key
        })

        const url = await getSignedUrl(s3client, command, { expiresIn: 12 * 60 * 60 })
        // console.log(url)
        return url;
    } catch (error) {
        return null;
    }
}

export const uploadObjectUrl = async (contentType, key) => {
    try {
        const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key,
            ContentType: contentType
        })

        const url = await getSignedUrl(s3client, command, { expiresIn: 3600 })
        return url;
    } catch (error) {
        return null;
    }
}

export const deleteS3BucketObject = async (key) => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: key
        })
        await s3client.send(command);
    } catch (error) {
        // console.log(error);
        throw new error(error)
    }
}