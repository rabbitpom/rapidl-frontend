import Glow from "@/components/ui/text-glow";
import Policy from "../Template/Policy";

function CookiePolicy() {
  return (
    <Policy title="Cookie Policy">
      <Glow
        glowClassName="bg-primary"
        textClassName="text-primary text-lg font-bold"
      >
        1. Introduction
      </Glow>
      <br />
      This cookie policy explains how we use cookies and similar technologies on
      our website.
      <br />
      <br />
      <Glow
        glowClassName="bg-primary"
        textClassName="text-primary text-lg font-bold"
      >
        2. What are cookies?
      </Glow>
      <br />
      Cookies are small text files that are placed on your computer or mobile
      device by a website when you visit it. They store information about your
      browsing activity and preferences, allowing the website to recognize you
      and remember your preferences (e.g., login information, language
      preference) over time.
      <br />
      <br />
      <Glow
        glowClassName="bg-primary"
        textClassName="text-primary text-lg font-bold"
      >
        3. What types of cookies do we use?
      </Glow>
      <div className="ml-5 mt-2">
        <Glow glowClassName="bg-primary" textClassName="text-primary">
          Essential Cookies
        </Glow>
        <div className="ml-5 mb-2">
          We use essential cookies to enable core website functionalities, such
          as user login and session management. These cookies are strictly
          necessary for the website to function properly and do not track your
          individual browsing activity or preferences beyond the current
          session.
        </div>
        <Glow glowClassName="bg-primary" textClassName="text-primary">
          Security
        </Glow>
        <div className="ml-5 mb-2">
          Essential cookies may also include your IP address for security
          purposes. This information is used solely to identify and prevent
          potential security risks and is not used for marketing or profiling
          purposes.
        </div>
        <Glow glowClassName="bg-primary" textClassName="text-primary">
          Functional, Advertising, and Analytics Cookies
        </Glow>
        <div className="ml-5 mb-2">
          We <b>do not</b> use any functional, advertising, or analytics cookies
          on our website.
        </div>
        <Glow glowClassName="bg-primary" textClassName="text-primary">
          Google reCAPTCHA
        </Glow>
        <div className="ml-5">
          Our website utilizes Google reCAPTCHA to protect against spam and
          abuse. Google's use of collected information is governed by their
          privacy policy, which we encourage you to review:{" "}
          <a
            href="https://policies.google.com/privacy"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://policies.google.com/privacy
          </a>
          .
        </div>
      </div>
      <br />
      <Glow
        glowClassName="bg-primary"
        textClassName="text-primary text-lg font-bold"
      >
        4. How to manage cookie preferences
      </Glow>
      <br />
      Most web browsers allow you to manage cookies through their settings. You
      can typically choose to block or delete cookies, or to receive a
      notification before a cookie is stored. Please refer to your browser's
      documentation for specific instructions.
      <br />
      <br />
      <Glow
        glowClassName="bg-primary"
        textClassName="text-primary text-lg font-bold"
      >
        5. Your commitment to user privacy
      </Glow>
      <br />
      At <Glow glowClassName="bg-white">rapidl</Glow>, we are committed to
      protecting your privacy. We only use essential cookies for the legitimate
      purpose of maintaining website functionality and security. We do not share
      any information collected through cookies with third parties for marketing
      or advertising purposes.
      <br />
      <br />
      <Glow
        glowClassName="bg-primary"
        textClassName="text-primary text-lg font-bold"
      >
        6. Cookie Lifespan
      </Glow>
      <br />
      Essential cookies used on <Glow glowClassName="bg-white">rapidl</Glow> are
      stored only for the duration you are logged in. Once you log out or your
      session expires, the cookies are automatically removed from your device.
      However, if you have not logged in for more than 3 days they will
      automatically be removed.
      <br />
      <br />
      <Glow
        glowClassName="bg-primary"
        textClassName="text-primary text-lg font-bold"
      >
        7. Contact information
      </Glow>
      <br />
      If you have any questions you can contact us{" "}
      <a
        href={HostURL + "/support/contact"}
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        here
      </a>
      .
    </Policy>
  );
}

export default CookiePolicy;
