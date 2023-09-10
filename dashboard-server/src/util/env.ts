const SECRET_KEY = process.env.SECRET_KEY || '';

if(!SECRET_KEY) {
    throw new Error(`SECRET_KEY is missing!`);
}

export { SECRET_KEY };