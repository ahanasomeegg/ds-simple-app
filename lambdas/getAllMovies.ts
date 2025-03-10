import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    console.log("Received event:", JSON.stringify(event, null, 2));

    const tableName = process.env.TABLE_NAME;

    try {
        const command = new ScanCommand({ TableName: tableName });
        const response = await docClient.send(command);

        return {
            statusCode: 200,
            body: JSON.stringify(response.Items),
        };
    } catch (error) {
        console.error("Error scanning table:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
}
