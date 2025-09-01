import Glow from "@/components/ui/text-glow";
import Policy from "../Template/Policy";

function PrivacyPolicy() {
  return (
    <Policy title="Privacy Policy">
      <Glow
        glowClassName="bg-primary"
        textClassName="text-primary text-lg font-bold"
      >
        This page is still being developed
      </Glow>
      <br />
      This page is currently under construction. Please check back soon for our
      complete privacy policy.
    </Policy>
  );
}

export default PrivacyPolicy;
