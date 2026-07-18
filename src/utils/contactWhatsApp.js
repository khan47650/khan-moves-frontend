const COMPANY_WHATSAPP_NUMBER = "447424153126";

const cleanValue = value =>
    String(value || "").trim() || "Not provided";

export const createContactWhatsAppMessage = formData => {
    return (
        `*NEW WEBSITE ENQUIRY*\n\n` +
        `*Customer Details*\n` +
        `Name: ${cleanValue(formData.name)}\n` +
        `Email: ${cleanValue(formData.email)}\n` +
        `Phone: ${cleanValue(formData.phone)}\n\n` +
        `*Subject*\n` +
        `${cleanValue(formData.subject)}\n\n` +
        `*Message*\n` +
        `${cleanValue(formData.message)}\n\n` +
        `Sent through Khan Moves website contact form.`
    );
};

export const openContactWhatsApp = formData => {
    const message = createContactWhatsAppMessage(formData);

    const whatsappUrl =
        `https://wa.me/${COMPANY_WHATSAPP_NUMBER}` +
        `?text=${encodeURIComponent(message)}`;

    const whatsappWindow = window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
    );

    if (!whatsappWindow) {
        window.location.href = whatsappUrl;
    }
};