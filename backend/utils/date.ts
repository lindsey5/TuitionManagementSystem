export const formatDateLong = (dateString?: string | Date | null): string => {
    if (!dateString) return "";

    const date = typeof dateString === "string" ? new Date(dateString) : dateString;

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};