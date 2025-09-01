import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { Desktop, TabletAndBelow } from "@/components/custom/responsive/device";
import { useRef } from "react";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import {
  email,
  minLength,
  maxLength,
  object,
  Output,
  string,
  custom,
} from "valibot";
import { toast } from "sonner";
import { Link } from "react-router-dom";

import Glow from "@/components/ui/text-glow";
import PlainPageContainer from "./Template/PlainPageContainer";
import NavigationBar from "./Template/NavigationBar";
import FooterBar from "./Template/FooterBar";
import DottedScroller from "@/components/ui/dotted-scroller";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const contactSchema: any = object({
  whoami: string([]),
  email: string([
    email("Invalid email"),
    minLength(1, "Invalid email"),
    maxLength(320, "Email is too long"),
  ]),
  name: string([
    minLength(1, "Input your name"),
    maxLength(16, "Name is too long"),
  ]),
  message: string([
    minLength(20, "Your message must be at least 20 characters"),
    maxLength(500, "Your message cannot be more than 500 characters"),
  ]),
  recaptcha: string([custom((i) => i !== "", "You must complete the captcha")]),
});

function ContactUs() {
  const Working = useRef(false);
  const recaptchaRef = useRef<ReCAPTCHA | null>(null);

  const contactForm = useForm<Output<typeof contactSchema>>({
    resolver: valibotResolver(contactSchema),
    defaultValues: {
      email: "",
      name: "",
      message: "",
      recaptcha: "",
    },
  });

  function onContactSubmit(_values: Output<typeof contactSchema>) {
    if (Working.current) {
      toast.error("Request already in progress");
      return;
    }
    Working.current = true;

    const payload = {
      whoami: _values.whoami,
      name: _values.name,
      message: _values.message,
      email: _values.email,
    };

    const promise = new Promise((resolveSuccess, resolveError) => {
      try {
        axios
          .post("/support/contact", payload, {
            headers: {
              "Content-Type": "application/json",
              recaptcha: _values.recaptcha,
            },
          })
          .then((response) => {
            resolveSuccess(response);
          })
          .catch((error) => {
            resolveError(error);
          });
      } catch (err) {
        resolveError(err);
      }
    });
    toast.promise(promise, {
      loading: "Sending your contact request",
      success: (response) => {
        Working.current = false;
        console.log(response);
        return "Successfully sent your contact request, please wait for a response before sending another one";
      },
      error: (error) => {
        Working.current = false;
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
        if (error.response) {
          if (error.response.status == 400 || error.response.status == 429) {
            return error.response.data;
          }
        }
        return "Failed to process your request, please try again later";
      },
    });
  }

  return (
    <>
      <DottedScroller />
      <NavigationBar />
      <PlainPageContainer
        fillPage={false}
        ringCard={false}
        className="mt-28 mb-28"
        desktopInnerClassName=""
        mobileOuterClassName="pt-[40px]"
        mobileInnerClassName=""
      >
        <Desktop>
          <div className="relative grid grid-cols-2 gap-28">
            <div className="overflow-hidden absolute left-[-500px] w-[1100px] h-[600px] pointer-events-none">
              <div className="relative">
                <img
                  src="/icons/triangle0.webp"
                  className="absolute object-contain pointer-events-none w-[1300px] h-[1300px] left-0 top-0 translate-x-[0px] translate-y-[-30%] transition-all duration-500 ease-in-out animate-[c-fade-in]"
                ></img>
              </div>
            </div>
            <div className="flex items-center justify-end min-h-[600px] relative left-auto right-32 w-[55vw] h-fit rounded-3xl bg-black/50 shadow-lg ring-1 ring-white/15 backdrop-blur-lg">
              <div className="h-full right-0 absolute">
                <div className="w-[1px] h-full absolute top-0 right-0 bg-gradient-to-t from-transparent via-white to-transparent"></div>
              </div>
              <Form {...contactForm}>
                <form
                  onSubmit={contactForm.handleSubmit(onContactSubmit)}
                  className="w-[400px] gap-4 flex flex-col my-[100px] mr-24"
                >
                  <div className="flex gap-4">
                    <FormField
                      control={contactForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-xl">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Your name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={contactForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-xl">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Your email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={contactForm.control}
                    name="whoami"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-xl">
                          Who are you?
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose the best description that fits you" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Student">A student</SelectItem>
                            <SelectItem value="Teacher">A teacher</SelectItem>
                            <SelectItem value="Company">A company</SelectItem>
                            <SelectItem value="Organisation">
                              An organisation
                            </SelectItem>
                            <SelectItem value="Unknown">
                              None of the above
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contactForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-xl">
                          Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us what you need"
                            className="resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contactForm.control}
                    name="recaptcha"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-x-2 space-y-0 pt-2">
                        <FormControl>
                          <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={TickReCaptchaSiteKey}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="max-w-32">
                    Send message
                  </Button>
                </form>
              </Form>
            </div>
            <div className="flex flex-row items-center h-full">
              <div className="flex flex-col w-[80%] gap-8">
                <h1 className="text-7xl font-medium">Contact Us</h1>
                <p>
                  Please direct all inquiries through the contact form to the
                  left. As a university student, responses may take a bit
                  longer, but I'll make sure to get back to you as soon as
                  possible.
                  <br />
                  <br />
                  Thank you for your patience, and please do not send any spam.
                </p>
                <div>
                  <h3 className="text-lg font-medium">Follow us:</h3>
                  <ul className="text-black dark:text-white font-medium flex gap-5 mt-2">
                    <li>
                      <Link
                        to="#"
                        className="text-black dark:text-white dark:hover:text-primary"
                      >
                        <svg
                          className="w-8 h-8"
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
                        className="text-black dark:text-white dark:hover:text-primary"
                      >
                        <svg
                          className="w-8 h-8"
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
              </div>
            </div>
          </div>
        </Desktop>
        <TabletAndBelow>
          <div className="flex flex-col w-[95%] gap-4 mx-auto">
            <h1 className="text-4xl font-medium">Contact Us</h1>
            <p>
              Please direct all inquiries through the contact form to the left.
              As a university student, responses may take a bit longer, but I'll
              make sure to get back to you as soon as possible.
              <br />
              <br />
              Thank you for your patience, and please do not send any spam.
            </p>
            <div>
              <h3 className="text-lg font-medium">Follow us:</h3>
              <ul className="text-black dark:text-white font-medium flex gap-5 mt-2">
                <li>
                  <Link
                    to="#"
                    className="text-black dark:text-white dark:hover:text-primary"
                  >
                    <svg
                      className="w-8 h-8"
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
                    className="text-black dark:text-white dark:hover:text-primary"
                  >
                    <svg
                      className="w-8 h-8"
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
            <div className="mt-8 flex items-center relative rounded-3xl bg-black/50 shadow-lg ring-1 ring-white/15 backdrop-blur-lg">
              <Form {...contactForm}>
                <form
                  onSubmit={contactForm.handleSubmit(onContactSubmit)}
                  className="p-5 gap-4 flex flex-col max-w-[100%] w-[100%]"
                >
                  <div className="flex gap-4 w-[100%]">
                    <FormField
                      control={contactForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-lg">
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              placeholder="Your name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={contactForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="font-semibold text-lg">
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="Your email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={contactForm.control}
                    name="whoami"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-lg">
                          Who are you?
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose the best description that fits you" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="student">A student</SelectItem>
                            <SelectItem value="teacher">A teacher</SelectItem>
                            <SelectItem value="company">A company</SelectItem>
                            <SelectItem value="organisation">
                              An organisation
                            </SelectItem>
                            <SelectItem value="none">
                              None of the above
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contactForm.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-lg">
                          Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us what you need"
                            className="resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={contactForm.control}
                    name="recaptcha"
                    render={({ field }) => (
                      <FormItem className="flex flex-col space-x-2 space-y-0 pt-2">
                        <FormControl>
                          <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey={TickReCaptchaSiteKey}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="max-w-32">
                    Send message
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </TabletAndBelow>
      </PlainPageContainer>
      <PlainPageContainer fillPage={false} mobileOuterClassName="pt-[10px]">
        <Accordion type="single" collapsible>
          <AccordionItem value="tab-response-time">
            <AccordionTrigger className="pt-0">
              <Glow
                glowClassName="bg-primary"
                textClassName="text-primary text-lg font-bold"
              >
                1. What is the response time for inquiries?
              </Glow>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col items-start">
              I am a university student, therefore I will be quite busy, but I
              will make an effort to check my emails on occasionally. Please be
              mindful that it may take me 1-3 days to respond.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="tab-more-qs">
            <AccordionTrigger className="pt-0">
              <Glow
                glowClassName="bg-primary"
                textClassName="text-primary text-lg font-bold"
              >
                2. Where could I see more questions?
              </Glow>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col items-start">
              <p>
                You can find commonly asked questions{" "}
                <a
                  href={HostURL + "/support/questions"}
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
        </Accordion>
      </PlainPageContainer>
      <FooterBar className="mt-[100px]" />
    </>
  );
}

export default ContactUs;
