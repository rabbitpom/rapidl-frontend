import { useEffect, Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getUTCSeconds } from "./lib/utils";
import Umami from "./components/Umami";

import "./App.css";

import { RootState } from "@/store/configure-store";
import { updateUserSliceAsync, flushUserSlice } from "@/store/slices/user";
import { Theme } from "@/components/theme";
import SessionAuthRoot from "./components/custom/auth/session-auth-root";
import Error from "@/page/Error";
import SessionNoAuth from "./components/custom/auth/session-no-auth";
import Loading1 from "./page/Preloader/Loading1";

function App() {
  const VerifyEmailBar = lazy(
    () => import("@/components/custom/sticky/verify-email-bar")
  );
  const GeneratedContentViewer = lazy(
    () => import("@/page/GeneratedContentViewer")
  );
  const Home = lazy(() => import("@/page/Home"));
  const PricingPage = lazy(() => import("@/page/Pricing"));
  const VerifyingPage = lazy(() => import("@/page/VerifyingContent/Verifying"));
  const FAQsPage = lazy(() => import("@/page/FAQs"));
  const AuthPage = lazy(() => import("@/page/Auth"));
  const ContactUsPage = lazy(() => import("@/page/ContactUs"));
  const PrivacyPolicyPage = lazy(
    () => import("@/page/PolicyContent/PrivacyPolicy")
  );
  const RefundPolicyPage = lazy(
    () => import("@/page/PolicyContent/RefundPolicy")
  );
  const CookiePolicyPage = lazy(
    () => import("@/page/PolicyContent/CookiePolicy")
  );
  const TermsOfServicePolicyPage = lazy(
    () => import("@/page/PolicyContent/TermsOfServicePolicy")
  );

  const location = useLocation();
  const dispatch = useDispatch();
  const sessionEnded = useSelector(
    (state: RootState) => state.tokenReducer.sessionEnded
  );
  const nextFetch = useSelector(
    (state: RootState) => state.userReducer.nextFetch
  );

  useEffect(() => {
    const { pathname } = location;
    if (pathname.toLowerCase().includes("generated/content/view")) {
      Umami.trackPageView("/generated/content/view"); // ignore the Uuid
      return;
    }
    Umami.trackPageView(pathname);
  }, [location]);

  useEffect(() => {
    if (sessionEnded) {
      dispatch(flushUserSlice());
    } else {
      dispatch(updateUserSliceAsync() as any);
    }
  }, [sessionEnded]);

  useEffect(() => {
    if (nextFetch <= 0) {
      return;
    }
    const secs = getUTCSeconds();
    if (secs > nextFetch) {
      dispatch(updateUserSliceAsync() as any);
      return;
    }
    const timer = setTimeout(() => {
      dispatch(updateUserSliceAsync() as any);
    }, (nextFetch - secs) * 1000 + 1);
    return () => clearInterval(timer);
  }, [nextFetch]);

  return (
    <SessionAuthRoot>
      <Theme>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Suspense>
                  <VerifyEmailBar />
                </Suspense>
                <Suspense fallback={<Loading1 />}>
                  <Home />
                </Suspense>
              </>
            }
          ></Route>
          <Route
            path="/home/*"
            element={
              <>
                <Suspense>
                  <VerifyEmailBar />
                </Suspense>
                <Suspense fallback={<Loading1 />}>
                  <Home />
                </Suspense>
              </>
            }
          ></Route>
          <Route
            path="/generated/content/view/*"
            element={
              <Suspense fallback={<Loading1 />}>
                <GeneratedContentViewer />
              </Suspense>
            }
          ></Route>
          <Route
            path="/verify/*"
            element={
              <Suspense fallback={<Loading1 />}>
                <VerifyingPage />
              </Suspense>
            }
          ></Route>
          <Route
            path="/auth/*"
            element={
              <SessionNoAuth redirect="/">
                <Suspense fallback={<Loading1 />}>
                  <AuthPage />
                </Suspense>
              </SessionNoAuth>
            }
          ></Route>
          <Route
            path="/support/questions"
            element={
              <>
                <Suspense>
                  <VerifyEmailBar />
                </Suspense>
                <Suspense fallback={<Loading1 />}>
                  <FAQsPage />
                </Suspense>
              </>
            }
          ></Route>
          <Route
            path="/support/contact"
            element={
              <>
                <Suspense>
                  <VerifyEmailBar />
                </Suspense>
                <Suspense fallback={<Loading1 />}>
                  <ContactUsPage />
                </Suspense>
              </>
            }
          ></Route>
          <Route
            path="/policy/privacy"
            element={
              <>
                <Suspense>
                  <VerifyEmailBar />
                </Suspense>
                <Suspense fallback={<Loading1 />}>
                  <PrivacyPolicyPage />
                </Suspense>
              </>
            }
          ></Route>
          <Route
            path="/policy/refund"
            element={
              <>
                <Suspense>
                  <VerifyEmailBar />
                </Suspense>
                <Suspense fallback={<Loading1 />}>
                  <RefundPolicyPage />
                </Suspense>
              </>
            }
          ></Route>
          <Route
            path="/policy/cookie"
            element={
              <>
                <Suspense>
                  <VerifyEmailBar />
                </Suspense>
                <Suspense fallback={<Loading1 />}>
                  <CookiePolicyPage />
                </Suspense>
              </>
            }
          ></Route>
          <Route
            path="/policy/termsofservice"
            element={
              <>
                <Suspense>
                  <VerifyEmailBar />
                </Suspense>
                <Suspense fallback={<Loading1 />}>
                  <TermsOfServicePolicyPage />
                </Suspense>
              </>
            }
          ></Route>
          <Route
            path="/pricing"
            element={
              <>
                <Suspense>
                  <VerifyEmailBar />
                </Suspense>
                <Suspense fallback={<Loading1 />}>
                  <PricingPage />
                </Suspense>
              </>
            }
          ></Route>
          <Route
            path="*"
            element={
              <Error
                code={"404 | Not Found"}
                messages={["The requested URL was not found"]}
              />
            }
          ></Route>
        </Routes>
      </Theme>
    </SessionAuthRoot>
  );
}

export default App;
