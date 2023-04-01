const {deterministicPartitionKey, createSha512Hash: hashData} = require("./dpk");
const crypto = require("crypto");

describe("deterministicPartitionKey", () => {
    const longPartitionKey = "0W1D6vtY06RHamtEXwReVkXx7M6qJJf9TuIuWYHOhBrQtN8oV5dTYZZdMy4IaYzIs77uiAY7CxK26BWAcFLHbD9MO2nZNc5wn9pJLFtXQJ5IK4IrP59KoNHXw4s4bPIHPGs6DILHa2KuhgYU9vaTiiPcpCDvv26sQjQWwbdKM6oIcBJ7SqjDCy1VPLKefTBc6SrLJgqBXGK52TkafwmOcqtbgbOXTuzXjkJzTCfJLRDLIKrCtaK1tF4dHtQWls1RhYq0yC44PqlLTelBc9QkAPmOAXjV1aSBL40JcXmPTvqI";
    const objectPartitionKey = {
        key: "kap3jRXRKFJg",
    };
    const longObjectPartitionKey = {
        key: "Q3kUmRZCwA4owP1jli1sog5WzXyLU3mtLsR9DVARCXwt4Q2VWOu9u9mxU9PYtPD9dJToGYbkYlORDGdM4kQsZncPqZlMDcBGd4HkJSY4GuEOuEiR9k9531Vte311ZNt2EARCIOwYBe6ZPXCjTpJsCgn3nQ95ixGcMJ2txEV49iHFZ7x9yuzyVsFV7AY2rFZVe2a75GWVAfWglA6kA5NEXbcdOHg3xzicUoIlEhdJH8uWwuDsay6eboxTIv9iF2uPZRs651ucWleuK20gnICszm3joyhVIkbrgED4k4zOTEnI",
    };
    const partitionKey = "TheTestForCBH";

    it("Returns the literal '0' when given no input", () => {
        const trivialKey = deterministicPartitionKey();
        expect(trivialKey).toBeDefined();
        expect(trivialKey).toBe("0");
    });

    it("Should not stringify the partition key if it is a string", () => {
        const notExpected = hashData(JSON.stringify(partitionKey));
        const result = deterministicPartitionKey({partitionKey});
        expect(result).toBeDefined();
        expect(result).not.toEqual(notExpected);
    });

    it("Should stringify the partition key if it is not a string", () => {
        const partitionKey = 35677;
        const expected = JSON.stringify(partitionKey);
        const result = deterministicPartitionKey({
            partitionKey
        });
        expect(result).toBeDefined();
        expect(result).toEqual(expected);
    });

    it("Should not hash the partition key if it is shorter than MAX_PARTITION_KEY_LENGTH", () => {
        const result = deterministicPartitionKey({partitionKey});
        expect(result).toBeDefined();
        expect(result).toEqual(partitionKey);
    });

    it("Should hash the partition key if it is longer than MAX_PARTITION_KEY_LENGTH", () => {
        const hashedKey = hashData(longPartitionKey);
        const result = deterministicPartitionKey({
            partitionKey: longPartitionKey,
        });
        expect(result).toBeDefined();
        expect(result).toEqual(hashedKey);
    });

    it("Should stringify and hash the partitionKey if it is longer than MAX_PARTITION_KEY_LENGTH", () => {
        const hashedKey = hashData(JSON.stringify(longObjectPartitionKey));
        const result = deterministicPartitionKey({
            partitionKey: longObjectPartitionKey,
        });
        expect(result).toBeDefined();
        expect(result).toEqual(hashedKey);
    });

    it("Should hash the event regardless of the length", () => {
        const hashedEvent = hashData(JSON.stringify(partitionKey));
        const result = deterministicPartitionKey(partitionKey);
        expect(result).toBeDefined();
        expect(result).toEqual(hashedEvent);
    });
});
