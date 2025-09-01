import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import Umami from "@/components/Umami";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { email, minLength, maxLength, object, Output, string } from "valibot";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

const subscribeSchema: any = object({
  email: string([
    email("Invalid email"),
    minLength(1, "Invalid email"),
    maxLength(320, "Email is too long"),
  ]),
});

interface Props {
  className?: string;
}

function Footer({ className }: Props) {
  const Working = useRef(false);
  const recaptchaSubscribeRef = useRef<ReCAPTCHA | null>(null);

  const subscribeForm = useForm<Output<typeof subscribeSchema>>({
    resolver: valibotResolver(subscribeSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubscribeSubmit(values: Output<typeof subscribeSchema>) {
    if (recaptchaSubscribeRef.current == null) {
      toast.error("Failed to subscribe");
      return;
    }
    const token = await recaptchaSubscribeRef.current.executeAsync();
    if (token == null) {
      toast.error("Failed to verify if you were human");
      return;
    }
    Working.current = true;

    const promise = new Promise((resolveSuccess, resolveError) => {
      try {
        axios
          .post("/subscribe/newsletter", values, {
            headers: {
              "Content-Type": "application/json",
              recaptcha: token,
            },
          })
          .then((response) => {
            resolveSuccess(response);

            Umami.logEvent("Newsletter request");
          })
          .catch((error) => {
            resolveError(error);

            Umami.logEvent("Newsletter request failure");
          });
      } catch (err) {
        resolveError(err);
      }
    });
    toast.promise(promise, {
      loading: "Requesting newsletter",
      success: (_) => {
        Working.current = false;
        return "Please check your inbox, including your spam folder, for an email from us. Click the confirmation link in that email to join our newsletter.";
      },
      error: (error) => {
        Working.current = false;
        if (recaptchaSubscribeRef.current) {
          recaptchaSubscribeRef.current.reset();
        }
        if (error.response) {
          if (error.response.status == 429) {
            return "It appears you've already submitted this email. Please check your inbox, including your spam folder, for an email from us. Click the confirmation link in that email to join our newsletter. You can attempt again in a few hours.";
          } else {
            return error.response.data;
          }
        } else if (error.request) {
          return "Your request could not be served at this time, please try again later.";
        } else {
          return `Failed to create account due to: ${error}`;
        }
      },
    });
  }

  return (
    <footer className={cn("w-full h-fit", className)}>
      <div className="h-[2px] bg-white dark:bg-black mb-[16px]"></div>
      <div className="h-[4px] bg-white dark:bg-black mb-[15px]"></div>
      <div className="h-[6px] bg-white dark:bg-black mb-[14px]"></div>
      <div className="h-[8px] bg-white dark:bg-black mb-[13px]"></div>
      <div className="h-[10px] bg-white dark:bg-black mb-[12px]"></div>
      <div className="h-[12px] bg-white dark:bg-black mb-[11px]"></div>
      <div className="h-[14px] bg-white dark:bg-black mb-[10px]"></div>
      <div className="h-[16px] bg-white dark:bg-black mb-[9px]"></div>
      <div className="h-[18px] bg-white dark:bg-black mb-[8px]"></div>
      <div className="h-[20px] bg-white dark:bg-black mb-[7px]"></div>
      <div className="h-[22px] bg-white dark:bg-black mb-[6px]"></div>
      <div className="h-[24px] bg-white dark:bg-black mb-[5px]"></div>
      <div className="h-[26px] bg-white dark:bg-black mb-[4px]"></div>
      <div className="h-[28px] bg-white dark:bg-black mb-[3px]"></div>
      <div className="h-[30px] bg-white dark:bg-black mb-[2px]"></div>
      <div className="relative bg-white dark:bg-black min-h-[100vh] px-[15%] flex flex-col justify-around">
        <div className="my-24">
          <div className="flex justify-between flex-col">
            <div className="relative">
              <a href={HostURL} className="flex items-center">
                <img
                  src="/company/logo.svg"
                  className="h-8 me-3"
                  alt="FlowBite Logo"
                />
                <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                  rapidl
                </span>
              </a>
              <p className="text-black dark:text-white mt-6">
                Tailored practice for exam success.
                <br />
                Conquer challenges one question at a time.
              </p>
            </div>
            <div className="grid gap-8 mt-6">
              <div>
                <h2 className="mb-6 text-lg font-semibold uppercase text-primary">
                  Legal
                </h2>
                <ul className="text-black dark:text-white font-medium">
                  <li className="mb-4">
                    <Link to="/policy/privacy" className="hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link to="/policy/cookie" className="hover:underline">
                      Cookie Policy
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link to="/policy/refund" className="hover:underline">
                      Refund Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/policy/termsofservice"
                      className="hover:underline"
                    >
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="mb-6 text-lg font-semibold uppercase text-primary">
                  Company
                </h2>
                <ul className="text-black dark:text-white font-medium">
                  <li className="mb-4">
                    <Link to="/info/aboutus" className="hover:underline">
                      About us
                    </Link>
                  </li>
                  <li className="mb-4">
                    <Link to="/support/contact" className="hover:underline">
                      Contact us
                    </Link>
                  </li>
                  <li>
                    <Link to="/support/questions" className="hover:underline">
                      FAQs
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-semibold uppercase text-primary">
                  Follow us
                </h2>
                <ul className="text-black dark:text-white font-medium flex gap-2">
                  <li>
                    <Link
                      to="#"
                      className="text-black dark:text-white dark:hover:text-primary ms-5"
                    >
                      <svg
                        className="w-4 h-4"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 21 16"
                      >
                        <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z" />
                      </svg>
                      <span className="sr-only">Discord community</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="text-black dark:text-white dark:hover:text-primary ms-5"
                    >
                      <svg
                        className="w-4 h-4"
                        viewBox="0 0 1200 1227"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z" />
                      </svg>
                      <span className="sr-only">X page</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-span-2">
                <h2 className="mb-6 text-lg font-semibold uppercase text-primary">
                  Subscribe
                </h2>
                <ul className="text-black dark:text-white font-medium">
                  <li className="mb-4">
                    <p>
                      Subscribe to stay tuned for latest updates.
                      <br />
                      Let's do it!
                    </p>
                  </li>
                  <li>
                    <Form {...subscribeForm}>
                      <form
                        onSubmit={subscribeForm.handleSubmit(onSubscribeSubmit)}
                        className="w-full flex gap-4"
                      >
                        <FormField
                          control={subscribeForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="Email"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button type="submit">SUBSCRIBE</Button>
                      </form>
                    </Form>
                    <ReCAPTCHA
                      ref={recaptchaSubscribeRef}
                      size="invisible"
                      sitekey={InvisibleReCaptchaSiteKey}
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="custom-shape-divider-bottom-1709294493">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 220"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="shape-fill"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="shape-fill"
            ></path>
          </svg>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
