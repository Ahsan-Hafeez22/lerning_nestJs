import { MongoDuplicateKeyError } from '../interface/mongo-error.interface';

const MONGO_DUPLICATE_KEY_CODE = 11000;

export function isMongoDuplicateKeyError(
  err: unknown,
): err is MongoDuplicateKeyError {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    typeof err.code === 'number' &&
    err.code === MONGO_DUPLICATE_KEY_CODE
  );
}
