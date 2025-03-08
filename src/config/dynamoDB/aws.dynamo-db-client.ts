import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { fromIni } from '@aws-sdk/credential-providers';
import { EnvName } from '@common/enums';

export const getDynamoDBClient = (configService: ConfigService) => {
    const isLocal =
        configService.get<string>(EnvName.NODE_ENV, 'development') ===
        'development';

    return DynamoDBDocumentClient.from(
        new DynamoDBClient({
            region: configService.get<string>(
                EnvName.AWS_REGION,
                defaultAwsConfig.region
            ),
            credentials: isLocal
                ? fromIni()
                : {
                      accessKeyId: configService.get<string>(
                          EnvName.AWS_ACCESS_KEY_ID,
                          defaultAwsConfig.accessKeyId
                      ),
                      secretAccessKey: configService.get<string>(
                          EnvName.AWS_SECRET_ACCESS_KEY,
                          defaultAwsConfig.secretAccessKey
                      ),
                  },
        })
    );
};

const defaultAwsConfig = {
    region: 'us-east-1',
    accessKeyId: '',
    secretAccessKey: '',
};
