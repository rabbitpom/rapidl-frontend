import Glow from "@/components/ui/text-glow";
import Policy from "../Template/Policy";

function RefundPolicy() {
  return (
    <Policy title="Refund Policy">
      <Glow
        glowClassName="bg-primary"
        textClassName="text-primary text-lg font-bold"
      >
        1. Commitment to Excellence
      </Glow>
      <br />
      At <Glow glowClassName="bg-white">rapidl</Glow>, we hold ourselves to the
      highest standards to ensure your complete satisfaction. We invest
      significant effort in delivering products and services of exceptional
      quality, meticulously crafted to meet and exceed your expectations.
      <br />
      <br />
      <Glow
        glowClassName="bg-primary"
        textClassName="text-primary text-lg font-bold"
      >
        2. Refund Policy
      </Glow>
      <br />
      We invest significant efforts into delivering products and services of the
      highest quality, meticulously crafted to meet and exceed your
      expectations. Regrettably, we do not offer refunds on purchases made
      through our platform. While we empathise with any concerns or issues you
      may encounter, our policy reflects our dedication to maintaining fairness
      and consistency for all our valued customers. We understand that
      unforeseen circumstances may arise, and we sincerely empathize with any
      difficulties you may encounter.
      <br />
      <br />
      <Glow
        glowClassName="bg-primary"
        textClassName="text-primary text-lg font-bold"
      >
        3. Dedicated Support
      </Glow>
      <br />
      Should you encounter any challenges or inconsistencies with your purchase,
      our dedicated support team is always available to assist you. We pledge to
      address any concerns promptly and comprehensively, striving for a
      resolution that meets your satisfaction within the framework of our
      policies.
      <br />
      <br />
      <Glow
        glowClassName="bg-primary"
        textClassName="text-primary text-lg font-bold"
      >
        4. Thank You for Choosing rapidl
      </Glow>
      <br />
      At <Glow glowClassName="bg-white">rapidl</Glow>, we view every interaction
      as an opportunity to strengthen our commitment to excellence and
      customer-centricity. Your trust and confidence are paramount to us, and we
      remain dedicated to delivering unparalleled value and service.
    </Policy>
  );
}

export default RefundPolicy;
