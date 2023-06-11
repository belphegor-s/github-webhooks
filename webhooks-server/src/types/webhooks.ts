export interface obj {
    [key: string]: string;
}

export interface webhooks {
    COMMIT: obj[],
    PUSH: obj[],
    MERGE: obj[]
}