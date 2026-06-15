import React from 'react';

export default function TermsPage() {
  return (
    <div className="w-full">
      {/* Page Header */}
      <section className="bg-[#C0392B] text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold">
            Terms & Conditions
          </h1>
          <p className="text-gray-100 mt-4">
            Last updated: June 2024
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 prose">
          <h2 className="text-2xl font-bold text-[#1a1a1a] mt-8 mb-4">
            1. Introduction
          </h2>
          <p className="text-gray-700 mb-6">
            These Terms & Conditions ("Terms") govern your use of the Khan Moves
            Limited website and booking service. By using our service, you agree to be
            bound by these Terms.
          </p>

          <h2 className="text-2xl font-bold text-[#1a1a1a] mt-8 mb-4">
            2. Service Description
          </h2>
          <p className="text-gray-700 mb-4">
            Khan Moves Limited provides removals and relocation services including:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Home removals</li>
            <li>Office relocations</li>
            <li>Furniture moves</li>
            <li>Courier services</li>
            <li>Pallet and bulk transport</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#1a1a1a] mt-8 mb-4">
            3. Booking and Quotation
          </h2>
          <p className="text-gray-700 mb-4">
            <strong>3.1 Quotations:</strong> All quotes provided through our website are
            estimates based on information provided by the customer. Final pricing may
            vary depending on actual job complexity, distance, and accessibility.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>3.2 Booking Request:</strong> Submitting a booking request does not
            constitute a binding contract. Your booking will only be confirmed once accepted
            by Khan Moves Limited and payment is received.
          </p>
          <p className="text-gray-700 mb-6">
            <strong>3.3 Booking Reference:</strong> You will receive a unique AV Booking
            Reference number upon submission. This reference must be quoted in all
            communication regarding your booking.
          </p>

          <h2 className="text-2xl font-bold text-[#1a1a1a] mt-8 mb-4">
            4. Payment Terms
          </h2>
          <p className="text-gray-700 mb-4">
            <strong>4.1 Payment Method:</strong> We accept payment via bank transfer. Payment
            details will be provided in your invoice.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>4.2 Payment Timing:</strong> Payment must be received before the
            scheduled moving date unless alternative arrangements have been agreed in writing.
          </p>
          <p className="text-gray-700 mb-6">
            <strong>4.3 Late Payment:</strong> If payment is not received by the due date,
            Khan Moves Limited reserves the right to reschedule or cancel your booking.
          </p>

          <h2 className="text-2xl font-bold text-[#1a1a1a] mt-8 mb-4">
            5. Cancellation and Rescheduling
          </h2>
          <p className="text-gray-700 mb-4">
            <strong>5.1 Cancellation Policy:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
            <li>Cancelled more than 14 days before: Full refund</li>
            <li>Cancelled 7-14 days before: 50% refund</li>
            <li>Cancelled less than 7 days before: No refund</li>
          </ul>
          <p className="text-gray-700 mb-6">
            <strong>5.2 Rescheduling:</strong> You may reschedule your booking for a fee
            of £15. Rescheduling requests must be made at least 48 hours before your
            scheduled moving date.
          </p>

          <h2 className="text-2xl font-bold text-[#1a1a1a] mt-8 mb-4">
            6. Liability and Insurance
          </h2>
          <p className="text-gray-700 mb-4">
            <strong>6.1 Insurance:</strong> Khan Moves Limited carries standard insurance
            for removals. Items are transported at the customer's risk unless specifically
            insured otherwise.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>6.2 Liability:</strong> Khan Moves Limited's liability is limited to
            the amount paid for the service. We are not responsible for loss, damage, or
            theft of items not directly caused by our negligence.
          </p>
          <p className="text-gray-700 mb-6">
            <strong>6.3 Fragile Items:</strong> Customers must clearly indicate fragile,
            valuable, or special items. Adequate packaging is essential. Khan Moves Limited
            is not responsible for damage to inadequately packaged items.
          </p>

          <h2 className="text-2xl font-bold text-[#1a1a1a] mt-8 mb-4">
            7. Customer Responsibilities
          </h2>
          <p className="text-gray-700 mb-4">
            <strong>7.1 Accurate Information:</strong> Customer must provide accurate
            information regarding items, locations, and access details.
          </p>
          <p className="text-gray-700 mb-4">
            <strong>7.2 Access:</strong> Customer is responsible for ensuring access to
            both pickup and delivery locations. Any additional charges for access issues
            are the customer's responsibility.
          </p>
          <p className="text-gray-700 mb-6">
            <strong>7.3 Prohibited Items:</strong> Customers must not include hazardous,
            illegal, or prohibited items in their shipment. Khan Moves Limited reserves
            the right to refuse service for non-compliant shipments.
          </p>

          <h2 className="text-2xl font-bold text-[#1a1a1a] mt-8 mb-4">
            8. Service Schedule
          </h2>
          <p className="text-gray-700 mb-4">
            <strong>8.1 Time Windows:</strong> We provide approximate time windows for
            service. We cannot guarantee exact arrival times due to traffic and other
            unforeseen circumstances.
          </p>
          <p className="text-gray-700 mb-6">
            <strong>8.2 Delays:</strong> While we strive to be punctual, Khan Moves Limited
            is not liable for delays caused by traffic, weather, or other external factors.
          </p>

          <h2 className="text-2xl font-bold text-[#1a1a1a] mt-8 mb-4">
            9. Complaints and Disputes
          </h2>
          <p className="text-gray-700 mb-4">
            <strong>9.1 Complaint Procedure:</strong> Any complaints must be reported within
            48 hours of service completion. Contact us at info@khanmoves.co.uk or
            0121 555 6666.
          </p>
          <p className="text-gray-700 mb-6">
            <strong>9.2 Resolution:</strong> We will investigate all complaints and respond
            within 7 business days.
          </p>

          <h2 className="text-2xl font-bold text-[#1a1a1a] mt-8 mb-4">
            10. Data Protection
          </h2>
          <p className="text-gray-700 mb-6">
            Your personal data will be processed according to UK GDPR regulations. We will
            only use your information for service delivery and communication purposes.
          </p>

          <h2 className="text-2xl font-bold text-[#1a1a1a] mt-8 mb-4">
            11. Website Disclaimer
          </h2>
          <p className="text-gray-700 mb-4">
            <strong>11.1 Accuracy:</strong> While we strive to ensure website accuracy,
            Khan Moves Limited does not warrant the accuracy or completeness of content.
          </p>
          <p className="text-gray-700 mb-6">
            <strong>11.2 Availability:</strong> Website access is provided on an "as-is"
            basis. We do not guarantee uninterrupted availability.
          </p>

          <h2 className="text-2xl font-bold text-[#1a1a1a] mt-8 mb-4">
            12. Changes to Terms
          </h2>
          <p className="text-gray-700 mb-6">
            Khan Moves Limited reserves the right to change these Terms at any time. Changes
            will be effective immediately upon posting to the website.
          </p>

          <h2 className="text-2xl font-bold text-[#1a1a1a] mt-8 mb-4">
            13. Governing Law
          </h2>
          <p className="text-gray-700 mb-6">
            These Terms are governed by the laws of England and Wales. Any disputes will be
            resolved in the English courts.
          </p>

          <h2 className="text-2xl font-bold text-[#1a1a1a] mt-8 mb-4">
            14. Contact Us
          </h2>
          <p className="text-gray-700 mb-2">
            For questions about these Terms, please contact:
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Khan Moves Limited</strong>
          </p>
          <p className="text-gray-700 mb-2">
            Email: <a href="mailto:info@khanmoves.co.uk" className="text-[#C0392B] font-semibold hover:underline">
              info@khanmoves.co.uk
            </a>
          </p>
          <p className="text-gray-700">
            Phone: <a href="tel:01215556666" className="text-[#C0392B] font-semibold hover:underline">
              0121 555 6666
            </a>
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-gray-600 mb-4">
            Understood and ready to book your move?
          </p>
          <a
            href="/booking"
            className="inline-block bg-[#C0392B] text-white font-bold px-8 py-3 rounded-lg hover:bg-red-800 transition"
          >
            Continue to Booking
          </a>
        </div>
      </section>
    </div>
  );
}
