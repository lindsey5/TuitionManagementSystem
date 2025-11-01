const generatePassword = (length: number = 12): string => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";

    const allChars = upper + lower + numbers;

    let password = "";

    // Ensure at least one from each category
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];

    // Fill remaining with random mix
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle so it's not predictable
    return password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
};

export default generatePassword;