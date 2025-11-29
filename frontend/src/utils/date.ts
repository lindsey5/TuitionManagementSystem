export const formatDateTime = (date: string | Date | null | undefined): string => {
    if (!date) return '';

    const d = typeof date === 'string' ? new Date(date) : date;

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM

    const formattedHours = String(hours).padStart(2, '0');

    return `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;
};

export const formatDate = (dateString?: string | Date): string => {
    if (!dateString) return "";

    const date = new Date(dateString);

    const month = String(date.getMonth() + 1).padStart(2, "0"); // 01–12
    const day = String(date.getDate()).padStart(2, "0");        // 01–31
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
};

export const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // add 1 day
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

export const formatDateLong = (dateString?: string | Date | null): string => {
    if (!dateString) return "";

    const date = typeof dateString === "string" ? new Date(dateString) : dateString;

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};