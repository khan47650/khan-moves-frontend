import React from "react";
import { FiX, FiMail, FiPhone } from "react-icons/fi";

export default function TermsDialog({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 p-4">
            <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 bg-[#DC2626] px-5 py-4 text-white">
                    <div>
                        <h2 className="text-lg font-bold">
                            Terms & Conditions
                        </h2>
                        <p className="text-xs text-red-100">
                            Khan Moves Limited
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white hover:text-[#DC2626]"
                        aria-label="Close terms"
                    >
                        <FiX size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto px-5 py-6 md:px-8">
                    <div className="space-y-8 text-sm leading-7 text-gray-700">

                        <section>
                            <h3 className="mb-3 text-lg font-bold text-[#1a1a1a]">
                                1. Introduction
                            </h3>
                            <p>
                                These Terms & Conditions ("Terms") govern your use of the
                                Khan Moves Limited website and booking service. By using our
                                service, you agree to be bound by these Terms.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-3 text-lg font-bold text-[#1a1a1a]">
                                2. Service Description
                            </h3>
                            <p className="mb-3">
                                Khan Moves Limited provides removals and relocation services
                                including:
                            </p>
                            <ul className="list-inside list-disc space-y-1">
                                <li>Home removals</li>
                                <li>Office relocations</li>
                                <li>Furniture moves</li>
                                <li>Courier services</li>
                                <li>Pallet and bulk transport</li>
                            </ul>
                        </section>

                        <section>
                            <h3 className="mb-3 text-lg font-bold text-[#1a1a1a]">
                                3. Booking and Quotation
                            </h3>

                            <p className="mb-3">
                                <strong>3.1 Quotations:</strong> All quotes provided through
                                our website are estimates based on information provided by
                                the customer. Final pricing may vary depending on actual job
                                complexity, distance and accessibility.
                            </p>

                            <p className="mb-3">
                                <strong>3.2 Booking Request:</strong> Submitting a booking
                                request does not constitute a binding contract. Your booking
                                will only be confirmed once accepted by Khan Moves Limited
                                and payment is received.
                            </p>

                            <p>
                                <strong>3.3 Booking Reference:</strong> You will receive a
                                unique booking reference number upon submission. This
                                reference must be quoted in all communication regarding your
                                booking.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-3 text-lg font-bold text-[#1a1a1a]">
                                4. Payment Terms
                            </h3>

                            <p className="mb-3">
                                <strong>4.1 Payment Method:</strong> We accept payment via
                                bank transfer. Payment details will be provided in your
                                invoice.
                            </p>

                            <p className="mb-3">
                                <strong>4.2 Payment Timing:</strong> Payment must be received
                                before the scheduled moving date unless alternative
                                arrangements have been agreed in writing.
                            </p>

                            <p>
                                <strong>4.3 Late Payment:</strong> If payment is not received
                                by the due date, Khan Moves Limited reserves the right to
                                reschedule or cancel your booking.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-3 text-lg font-bold text-[#1a1a1a]">
                                5. Cancellation and Rescheduling
                            </h3>

                            <p className="mb-3">
                                <strong>5.1 Cancellation Policy:</strong>
                            </p>

                            <ul className="mb-3 list-inside list-disc space-y-1">
                                <li>Cancelled more than 14 days before: Full refund</li>
                                <li>Cancelled 7-14 days before: 50% refund</li>
                                <li>Cancelled less than 7 days before: No refund</li>
                            </ul>

                            <p>
                                <strong>5.2 Rescheduling:</strong> You may reschedule your
                                booking for a fee of £15. Rescheduling requests must be made
                                at least 48 hours before your scheduled moving date.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-3 text-lg font-bold text-[#1a1a1a]">
                                6. Liability and Insurance
                            </h3>

                            <p className="mb-3">
                                <strong>6.1 Insurance:</strong> Khan Moves Limited carries
                                standard insurance for removals. Items are transported at
                                the customer's risk unless specifically insured otherwise.
                            </p>

                            <p className="mb-3">
                                <strong>6.2 Liability:</strong> Khan Moves Limited's liability
                                is limited to the amount paid for the service. We are not
                                responsible for loss, damage or theft of items not directly
                                caused by our negligence.
                            </p>

                            <p>
                                <strong>6.3 Fragile Items:</strong> Customers must clearly
                                indicate fragile, valuable or special items. Adequate
                                packaging is essential. Khan Moves Limited is not responsible
                                for damage to inadequately packaged items.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-3 text-lg font-bold text-[#1a1a1a]">
                                7. Customer Responsibilities
                            </h3>

                            <p className="mb-3">
                                <strong>7.1 Accurate Information:</strong> Customers must
                                provide accurate information regarding items, locations and
                                access details.
                            </p>

                            <p className="mb-3">
                                <strong>7.2 Access:</strong> Customers are responsible for
                                ensuring access to both pickup and delivery locations. Any
                                additional charges caused by access issues are the customer's
                                responsibility.
                            </p>

                            <p>
                                <strong>7.3 Prohibited Items:</strong> Customers must not
                                include hazardous, illegal or prohibited items in their
                                shipment. Khan Moves Limited reserves the right to refuse
                                service for non-compliant shipments.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-3 text-lg font-bold text-[#1a1a1a]">
                                8. Service Schedule
                            </h3>

                            <p className="mb-3">
                                <strong>8.1 Time Windows:</strong> We provide approximate
                                time windows for service. We cannot guarantee exact arrival
                                times due to traffic and other unforeseen circumstances.
                            </p>

                            <p>
                                <strong>8.2 Delays:</strong> While we strive to be punctual,
                                Khan Moves Limited is not liable for delays caused by traffic,
                                weather or other external factors.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-3 text-lg font-bold text-[#1a1a1a]">
                                9. Complaints and Disputes
                            </h3>

                            <p className="mb-3">
                                <strong>9.1 Complaint Procedure:</strong> Any complaints must
                                be reported within 48 hours of service completion. Contact us
                                at{" "}
                                <a
                                    href="mailto:khanmovesuk@gmail.com"
                                    className="font-semibold text-[#C0392B] hover:underline"
                                >
                                    khanmovesuk@gmail.com
                                </a>{" "}
                                or{" "}
                                <a
                                    href="tel:+447424153126"
                                    className="font-semibold text-[#C0392B] hover:underline"
                                >
                                    07424 153126
                                </a>.
                            </p>

                            <p>
                                <strong>9.2 Resolution:</strong> We will investigate all
                                complaints and respond within 7 business days.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-3 text-lg font-bold text-[#1a1a1a]">
                                10. Data Protection
                            </h3>

                            <p>
                                Your personal data will be processed according to UK GDPR
                                regulations. We will only use your information for service
                                delivery and communication purposes.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-3 text-lg font-bold text-[#1a1a1a]">
                                11. Website Disclaimer
                            </h3>

                            <p className="mb-3">
                                <strong>11.1 Accuracy:</strong> While we strive to ensure
                                website accuracy, Khan Moves Limited does not warrant the
                                accuracy or completeness of content.
                            </p>

                            <p>
                                <strong>11.2 Availability:</strong> Website access is provided
                                on an "as-is" basis. We do not guarantee uninterrupted
                                availability.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-3 text-lg font-bold text-[#1a1a1a]">
                                12. Changes to Terms
                            </h3>

                            <p>
                                Khan Moves Limited reserves the right to change these Terms
                                at any time. Changes will be effective immediately upon
                                posting to the website.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-3 text-lg font-bold text-[#1a1a1a]">
                                13. Governing Law
                            </h3>

                            <p>
                                These Terms are governed by the laws of England and Wales.
                                Any disputes will be resolved in the English courts.
                            </p>
                        </section>

                        <section>
                            <h3 className="mb-3 text-lg font-bold text-[#1a1a1a]">
                                14. Contact Us
                            </h3>

                            <p className="mb-4">
                                For questions about these Terms, please contact Khan Moves
                                Limited.
                            </p>

                            <div className="space-y-3 rounded-xl border border-red-100 bg-red-50 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C0392B] text-white">
                                        <FiMail size={17} />
                                    </div>

                                    <a
                                        href="mailto:khanmovesuk@gmail.com"
                                        className="font-semibold text-[#C0392B] hover:underline"
                                    >
                                        khanmovesuk@gmail.com
                                    </a>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#C0392B] text-white">
                                        <FiPhone size={17} />
                                    </div>

                                    <a
                                        href="tel:+447424153126"
                                        className="font-semibold text-[#C0392B] hover:underline"
                                    >
                                        07424 153126
                                    </a>
                                </div>
                            </div>
                        </section>

                    </div>
                </div>

            </div>
        </div>
    );
}