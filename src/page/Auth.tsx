import { useEffect, useRef } from "react";
import Umami from "@/components/Umami";

import isAlphanumeric from "validator/lib/isAlphanumeric";
import isStrongPassword from "validator/lib/isStrongPassword";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { Desktop } from "@/components/custom/responsive/device";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  email,
  minLength,
  maxLength,
  object,
  Output,
  regex,
  string,
  custom,
  boolean,
} from "valibot";

import HoverableImage from "@/components/custom/image/hoverable-image";
import DottedScroller from "@/components/ui/dotted-scroller";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";

const loginSchema: any = object({
  email: string([
    email("Invalid email"),
    minLength(1, "Invalid email"),
    maxLength(320, "Email is too long"),
  ]),
  password: string([
    minLength(8, "Password must have at least 8 characters"),
    maxLength(16, "Password cannot have more than 16 characters"),
    regex(
      new RegExp("^[a-zA-Z0-9!?@#\\/+*^%,_-]+$"),
      "Password can only contain letters, numbers, or special characters"
    ),
  ]),
  recaptcha: string([custom((i) => i !== "", "You must complete the captcha")]),
});

const signupSchema: any = object(
  {
    username: string([
      minLength(3, "Username must have at least 3 characters"),
      maxLength(16, "Username cannot have more than 16 characters"),
      custom(
        (i) => isAlphanumeric(i),
        "Username must contain letters or numbers only"
      ),
    ]),
    email: string([
      email("Invalid email"),
      minLength(1, "Invalid email"),
      maxLength(320, "Email is too long"),
    ]),
    password: string([
      minLength(8, "Password must have at least 8 characters"),
      maxLength(16, "Password cannot have more than 16 characters"),
      regex(
        new RegExp("^[a-zA-Z0-9!?@#\\/+*^%,_-]+$"),
        "Password can only contain letters, numbers, or special characters"
      ),
      custom(
        (i) => isStrongPassword(i, { minLength: 8 }),
        "Password is too weak"
      ),
    ]),
    confirmPassword: string(),
    tos: boolean([
      custom(
        (i) => i,
        "You must agree to our Terms of Service and Privacy Policy"
      ),
    ]),
    recaptcha: string([
      custom((i) => i !== "", "You must complete the captcha"),
    ]),
  },
  [
    custom(
      ({ password, confirmPassword }) => password === confirmPassword,
      "The passwords do not match."
    ),
  ]
);

function Auth() {
  const NavigateTo = useNavigate();
  const Working = useRef(false);
  const Location = useLocation();
  let NavigateMode = Location.pathname.split("/")[2];
  if (NavigateMode !== "login" && NavigateMode !== "sign-up") {
    NavigateMode = "login";
  }
  useEffect(() => {
    window.history.replaceState(null, "auth-page", "/auth");
  }, []);

  const recaptchaSignUpRef = useRef<ReCAPTCHA | null>(null);
  const recaptchaLoginRef = useRef<ReCAPTCHA | null>(null);

  const signupForm = useForm<Output<typeof signupSchema>>({
    resolver: valibotResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      tos: false,
      recaptcha: "",
    },
  });

  const loginForm = useForm<Output<typeof loginSchema>>({
    resolver: valibotResolver(loginSchema),
    defaultValues: {
      password: "",
      email: "",
      recaptcha: "",
    },
  });

  function onSignUpSubmit(_values: Output<typeof signupSchema>) {
    if (Working.current) {
      toast.error("Request already in progress");
      return;
    }
    Working.current = true;

    // deep copy
    const payload = {
      username: _values.username,
      password: _values.password,
      email: _values.email,
    };

    const promise = new Promise((resolveSuccess, resolveError) => {
      try {
        axios
          .post("/sign-up", payload, {
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
      loading: "Creating your account",
      success: (_) => {
        Working.current = false;
        NavigateTo("/", { replace: true });

        Umami.logEvent("Create account");

        return "Successfully created account";
      },
      error: (err) => {
        Working.current = false;
        if (recaptchaSignUpRef.current) {
          recaptchaSignUpRef.current.reset();
        }

        Umami.logEvent("Create account failure");

        return `Failed to create account due to: ${err}`;
      },
    });
  }

  function onLoginSubmit(_values: Output<typeof loginSchema>) {
    if (Working.current) {
      toast.error("Request already in progress");
      return;
    }

    Working.current = true;

    // shallow copy
    const payload = {
      password: _values.password,
      email: _values.email,
    };

    const promise = new Promise((resolveSuccess, resolveError) => {
      try {
        axios
          .post("/login", payload, {
            headers: {
              "Content-Type": "application/json",
              recaptcha: _values.recaptcha,
            },
          })
          .then((response) => {
            Umami.logEvent("Login to account success");
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
      loading: "Logging into your account",
      success: (_) => {
        Working.current = false;
        NavigateTo("/", { replace: true });
        return "Successfully logged into account";
      },
      error: (err) => {
        Working.current = false;
        if (recaptchaLoginRef.current) {
          recaptchaLoginRef.current.reset();
        }
        if (err.response) {
          if (err.response.status == 401) {
            return `Incorrect email or password`;
          }
          return `Failed to log into account due to: ${err}`;
        } else if (err.request) {
          return `Failed to log into account due to: ${err}`;
        } else {
          return `Failed to log into account due to: ${err}`;
        }
      },
    });
  }

  return (
    <>
      <DottedScroller color="rgba(125, 125, 125, 20%)" />
      <div className="flex absolute left-1/2 -translate-x-1/2 mt-10">
        <Tabs
          defaultValue={NavigateMode}
          className="w-fit flex flex-col items-center"
        >
          <TabsList className="bg-card">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="sign-up">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="flex">
            <Desktop>
              <HoverableImage
                src="/icons/mascot-login.png"
                alt="icon of login"
                triggerClassName="z-[-1] h-[400px] w-[500px] fixed left-[-110%] top-[65%] -translate-y-1/2"
                className="object-contain pointer-events-none transition-all duration-500 ease-in-out animate-[c-fade-in,c-slide-in-y]"
              >
                Artwork created by{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  to="https://x.com/mangoo454"
                  className="text-white font-semibold hover:underline hover:decoration-2"
                >
                  <span className="text-primary">@</span>
                  mangoo454
                </Link>
              </HoverableImage>
            </Desktop>
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLoginSubmit)}
                className="space-y-8 mb-10 mt-[30%]"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Welcome back!</CardTitle>
                    <CardDescription>
                      Please log in to your account and continue to enjoy our
                      services.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="recaptcha"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-x-2 space-y-0 pt-2">
                          <FormControl>
                            <ReCAPTCHA
                              ref={recaptchaLoginRef}
                              sitekey={TickReCaptchaSiteKey}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <Button type="submit" className="w-full">
                      LOGIN
                    </Button>
                    <Separator className="w-full mx-auto my-5" />
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/">HOME</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="sign-up" className="flex">
            <Form {...signupForm}>
              <form
                onSubmit={signupForm.handleSubmit(onSignUpSubmit)}
                className="space-y-8 mb-10"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Hello!</CardTitle>
                    <CardDescription>
                      Register an account to access our services, and new users
                      can enjoy <br />
                      complimentary credits for a trial experience.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <FormField
                      control={signupForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password confirmation</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="recaptcha"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-x-2 space-y-0 pt-2">
                          <FormControl>
                            <ReCAPTCHA
                              ref={recaptchaSignUpRef}
                              sitekey={TickReCaptchaSiteKey}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signupForm.control}
                      name="tos"
                      render={({ field }) => (
                        <FormItem className="flex flex-col space-x-2 space-y-0 pt-2">
                          <div className="items-top flex">
                            <FormControl>
                              <Checkbox
                                id="tos"
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="grid gap-1.5 leading-none ml-2">
                              <label
                                htmlFor="tos"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Accept terms and conditions
                              </label>
                              <p className="text-sm text-muted-foreground">
                                You agree to our Terms of Service and Privacy
                                Policy.
                              </p>
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter className="flex flex-col">
                    <Button type="submit" className="w-full">
                      SIGN UP
                    </Button>
                    <Separator className="w-full mx-auto my-5" />
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/">HOME</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </form>
            </Form>
            <Desktop>
              <HoverableImage
                src="/icons/mascot-signUp.png"
                alt="icon of sign up"
                triggerClassName="z-[-1] h-[550px] w-[550px] fixed right-[-115%] top-1/2 -translate-y-1/2"
                className="object-contain pointer-events-none transition-all duration-500 ease-in-out animate-[c-fade-in,c-slide-in-y]"
              >
                Artwork created by{" "}
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  to="https://x.com/mangoo454"
                  className="text-white font-semibold hover:underline hover:decoration-2"
                >
                  <span className="text-primary">@</span>
                  mangoo454
                </Link>
              </HoverableImage>
            </Desktop>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default Auth;
