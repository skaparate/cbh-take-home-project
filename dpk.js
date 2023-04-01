const crypto = require("crypto");

const MAX_PARTITION_KEY_LENGTH = 256;
const TRIVIAL_PARTITION_KEY = "0";

/**
 * Hashes the data using SHA3-512 and digests it to hex
 *
 * @param {string} data The data to be hashed
 * @returns A hex representation of the hashed data
 */
function createSha512Hash(data) {
    return crypto.createHash("sha3-512").update(data).digest("hex");
}

const deterministicPartitionKey = (event) => {
    if (!event) {
        return TRIVIAL_PARTITION_KEY;
    }

    let {partitionKey: candidate} = event;

    if (!candidate) {
        const json = JSON.stringify(event);
        candidate = createSha512Hash(json);
    }

    if (typeof candidate !== "string") {
        candidate = JSON.stringify(candidate);
    }

    if (candidate.length > MAX_PARTITION_KEY_LENGTH) {
        candidate = createSha512Hash(candidate);
    }

    return candidate;
};

module.exports = {
    deterministicPartitionKey,
    createSha512Hash
};