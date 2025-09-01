import Glow from "@/components/ui/text-glow";
import PlainPage from "./Template/PlainPage";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

function FAQs() {
  return (
    <PlainPage>
      <Accordion type="single" collapsible>
        <AccordionItem value="tab-who-am-i">
          <AccordionTrigger className="pt-0">
            <Glow
              glowClassName="bg-primary"
              textClassName="text-primary text-lg font-bold"
            >
              1. Who am I?
            </Glow>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col items-start">
            I'm a typical student, currently pursuing my Computer Science BSc
            degree at the University of Leicester.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="tab-whats">
          <AccordionTrigger className="pt-0">
            <Glow
              glowClassName="bg-primary"
              textClassName="text-primary text-lg font-bold"
            >
              2. What's rapidl?
            </Glow>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col items-start">
            <p>
              <Glow glowClassName="bg-white">rapidl</Glow> was born out of my
              own experience as a resource-constrained student. Faced with a
              limited number of past papers in the new specification, I found
              myself at a disadvantage.
              <br />
              <br />
              Sure, I could refer to the old specification, but encountering
              unfamiliar concepts left me puzzled and wasted my time. Even
              consulting the mark scheme felt like a spoiler, especially when it
              turned out to be something I should have known.
              <br />
              <br />
              That's why I created <Glow glowClassName="bg-white">
                rapidl
              </Glow>{" "}
              — a project designed to address these challenges head-on. Its
              primary goal is to cater to the new specification, providing a
              wide range of subjects to explore. With{" "}
              <Glow glowClassName="bg-white">rapidl</Glow>, you'll have access
              to an extensive collection of unique revision resources, ensuring
              that you never run out of valuable study materials.
              <br />
              <br />
              <Glow glowClassName="bg-primary" textClassName="text-primary">
                Important Notice
              </Glow>
              <br />
              While <Glow glowClassName="bg-white">rapidl</Glow> offers randomly
              generated resources, it is crucial to note that these should not
              be solely relied upon as your sole revision material. This service
              is specifically tailored for individuals who are seeking an
              additional means to challenge themselves in preparation for their
              upcoming examinations. It is strongly recommended to supplement
              your studies with comprehensive resources and materials to ensure
              a well-rounded and thorough understanding of the subject matter.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="tab-how-are-generated">
          <AccordionTrigger className="py-0">
            <Glow
              glowClassName="bg-primary"
              textClassName="text-primary text-lg font-bold"
            >
              3. How are questions generated?
            </Glow>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col items-start">
            <p>
              The questions within <Glow glowClassName="bg-white">rapidl</Glow>{" "}
              are generated using proprietary software.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="tab-how-contribute">
          <AccordionTrigger className="py-0">
            <Glow
              glowClassName="bg-primary"
              textClassName="text-primary text-lg font-bold"
            >
              4. How could I contribute?
            </Glow>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col items-start">
            <p>
              If you would like to contribute, please ensure that the material
              you provide can be shared commercially, and that you have the
              necessary rights to do so.
              <br />
              <br />
              To maintain the highest standards of legality and quality, we
              conduct a thorough investigation of all materials sent to us. This
              is done to ensure compliance with copyright laws and to prevent
              any potential legal issues. Your cooperation in this matter is
              crucial as we strive to provide a reliable and legally sound
              platform.
              <br />
              <br />
              You can contact us using the contacts form{" "}
              <a
                href={HostURL + "/support/contact"}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
              <br />
              <span className="text-sm text-foreground">
                <i>We will not accept any attached files via form or email.</i>
              </span>
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="tab-unlimited-credits">
          <AccordionTrigger className="py-0">
            <Glow
              glowClassName="bg-primary"
              textClassName="text-primary text-lg font-bold"
            >
              5. As a teacher, school, or organisation, am I eligible for
              unlimited credits?
            </Glow>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col items-start">
            <p>
              If you are a teacher, school, or organisation, interested in
              acquiring unlimited credits, you may, at a discounted price. We
              encourage you to contact us directly using our contacts form{" "}
              <a
                href={HostURL + "/support/contact"}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
              <br />
              <br />
              We are open to negotiating special arrangements. In order to
              ensure eligibility, we may request your details for verification
              purposes. We want to assure you that any information you share
              with us will be handled in accordance with our privacy policy.
              <br />
              <br />
              Safeguarding your privacy and protecting your personal data is of
              the utmost importance to us. We strictly adhere to
              industry-standard security measures and best practices to ensure
              the confidentiality and integrity of the information you provide.
              <br />
              <br />
              You can review our privacy policy to gain a better understanding
              of how we handle and protect your data. If you have any concerns
              or questions regarding your privacy or data security, please do
              not hesitate to reach out to us.
              <br />
              <br />
              <Glow glowClassName="bg-primary" textClassName="text-primary">
                Important Notice
              </Glow>
              <br />
              <Glow glowClassName="bg-white">rapidl</Glow> has the right to
              decline your requests.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="tab-refunds">
          <AccordionTrigger className="py-0">
            <Glow
              glowClassName="bg-primary"
              textClassName="text-primary text-lg font-bold"
            >
              6. Can I get refunds?
            </Glow>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col items-start">
            <p>
              You can view our refund policy{" "}
              <a
                href={HostURL + "/policy/refund"}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="tab-get-in-touch">
          <AccordionTrigger className="py-0">
            <Glow
              glowClassName="bg-primary"
              textClassName="text-primary text-lg font-bold"
            >
              7. How do I get in touch?
            </Glow>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col items-start">
            <p>
              You can contact us{" "}
              <a
                href={HostURL + "/support/contact"}
                className="text-blue-500 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                here
              </a>
              .
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="tab-dev-apis">
          <AccordionTrigger className="py-0">
            <Glow
              glowClassName="bg-primary"
              textClassName="text-primary text-lg font-bold"
            >
              8. Are there any APIs available for developers?
            </Glow>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col items-start">
            <p>
              We don't have an API available for developers at the moment. We
              know APIs are crucial for many projects, and we're looking into
              options for the future.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </PlainPage>
  );
}

export default FAQs;
