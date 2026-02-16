"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const LeadCaptureForm = () => {
  const pathname = usePathname();

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [userType, setUserType] = useState<"homeowner" | "builder">("homeowner");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return Boolean(isValidEmail(email.trim()) && firstName.trim());
  }, [email, firstName]);

  async function submit() {
    setError(null);
    setSuccess(null);

    const em = email.trim();
    const fn = firstName.trim();

    if (!fn) return setError("First name is required");
    if (!em) return setError("Email is required");
    if (!isValidEmail(em)) return setError("Enter a valid email");

    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          first_name: fn,
          email: em,
          user_type: userType,
          source: "lead_capture",
          page_path: pathname,
        }),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(String((json as any)?.error ?? "Failed to submit"));

      setSuccess("Thanks — check your inbox shortly.");
      setEmail("");
      setFirstName("");
      setUserType("homeowner");
    } catch (e: any) {
      setError(String(e?.message ?? "Failed to submit"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="static bg-transparent box-content caret-black min-h-0 min-w-0 outline-black w-auto mr-0 rounded-l-none md:relative md:aspect-auto md:bg-transparent md:box-border md:caret-transparent md:min-h-full md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-[48%] md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-none">
      <div className="static box-content caret-black min-h-0 outline-black w-auto md:relative md:aspect-auto md:box-border md:caret-transparent md:min-h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:overflow-clip md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
        <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row justify-normal outline-black gap-y-[normal] w-auto p-0 md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[28.416px] md:flex md:flex-col md:justify-start md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[28.416px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:pl-[71.168px] md:pr-[120.832px] md:pt-[35.584px] md:pb-[42.624px] md:scroll-m-0 md:scroll-p-[auto]">
          <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[7.168px] md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[7.168px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[14.208px] md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[14.208px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <div className="text-base normal-nums font-normal box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-start text-wrap md:text-[28px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:leading-[35.52px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:text-center md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                <p className="box-content caret-black outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  Get Your{" "}
                </p>
              </div>
              <div className="[align-items:normal] bg-transparent box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] p-0 rounded-none md:items-center md:aspect-auto md:bg-orange-600 md:box-border md:caret-transparent md:gap-x-[8.88px] md:flex md:shrink-0 md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.88px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:pt-[3.552px] md:pb-[1.776px] md:px-[17.76px] md:scroll-m-0 md:scroll-p-[auto] md:rounded-[3.35544e+07px]">
                <div className="text-black text-base normal-nums font-normal box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black text-start text-wrap md:text-white md:text-[28px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:leading-[35.52px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:text-center md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                  <p className="box-content caret-black outline-black text-wrap md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:text-nowrap md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    Free Guide
                  </p>
                </div>
              </div>
            </div>
            <div className="text-base normal-nums font-normal box-content caret-black leading-[normal] min-h-0 min-w-0 outline-black md:text-[28px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:leading-[35.52px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
              <p className="box-content caret-black outline-black md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                &quot;How to Choose the Perfect Plan&quot;
              </p>
            </div>
          </div>
          <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[35.584px] md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[24.864px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
            <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[21.376px] md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:-translate-y-[9px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[21.376px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
             <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-transparent md:gap-x-[5.376px] md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[5.376px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
               <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[5.376px] md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[5.376px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                 <div className="text-base normal-nums font-normal box-content caret-black block flex-row justify-normal leading-[normal] min-h-0 min-w-0 outline-black md:text-[14px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-center md:leading-[16.872px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                   <p className="box-content caret-black min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                     First Name
                   </p>
                 </div>
               </div>
                <div className="static bg-transparent box-content caret-black shrink min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-white md:box-border md:caret-black md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[3.35544e+07px]">
                  <div className="static box-content caret-black outline-black pointer-events-auto rounded-none inset-auto md:absolute md:aspect-auto md:box-border md:caret-black md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:pointer-events-none md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[3.35544e+07px] md:border-solid md:inset-0"></div>
                  <div className="static [align-items:normal] box-content caret-black block h-auto outline-black w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-black md:flex md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto p-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-black md:gap-x-[5.376px] md:flex md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[5.376px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:pl-4 md:pr-[10.624px] md:py-[12.416px] md:scroll-m-0 md:scroll-p-[auto]">
                      <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block basis-auto grow-0 shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:box-border md:caret-black md:gap-x-[8.832px] md:flex md:basis-0 md:grow md:shrink-0 md:justify-center md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                        <input
                         type="text"
                         placeholder="David"
                         value={firstName}
                         onChange={(e) => setFirstName(e.target.value)}
                         className="text-[13.3333px] normal-nums bg-white box-content caret-black inline-block basis-auto grow-0 leading-[normal] min-h-0 min-w-0 outline-black text-start focus:outline-none md:text-[13.32px] md:aspect-auto md:bg-transparent md:box-border md:caret-black md:block md:basis-0 md:grow md:leading-[19.536px] md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto]"
                       />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-3 md:mt-0 md:-translate-y-[10px]">
             <div className="text-[15px] font-medium text-neutral-900">I am a</div>
             <div className="mt-2 flex flex-col gap-2">
               <label className="flex items-start gap-2 text-[15px] font-medium text-neutral-900">
                 <input
                   type="radio"
                    name="lead_user_type"
                    checked={userType === "homeowner"}
                    onChange={() => setUserType("homeowner")}
                    className="mt-[2px] h-4 w-4 accent-orange-600"
                  />
                  <span>Future Dream Homeowner (Living in the Home)</span>
                </label>
                <label className="flex items-start gap-2 text-[15px] font-medium text-neutral-900">
                  <input
                    type="radio"
                    name="lead_user_type"
                    checked={userType === "builder"}
                    onChange={() => setUserType("builder")}
                    className="mt-[2px] h-4 w-4 accent-orange-600"
                  />
                  <span>Licensed Builder (Building the Home)</span>
                </label>
             </div>
           </div>
           <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block flex-row shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-start md:aspect-auto md:box-border md:caret-black md:gap-x-[5.376px] md:flex md:flex-col md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:-translate-y-[10px] md:mb-[15px] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[5.376px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
             <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-black md:gap-x-[5.376px] md:flex md:shrink-0 md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[5.376px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
               <div className="text-base normal-nums font-normal box-content caret-black block flex-row justify-normal leading-[normal] min-h-0 min-w-0 outline-black md:text-[14px] md:font-semibold md:aspect-auto md:box-border md:caret-black md:flex md:flex-col md:justify-center md:leading-[16.872px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                 <p className="box-content caret-black min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-black md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                   Email
                 </p>
               </div>
             </div>
             <div className="static bg-transparent box-content caret-black shrink min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-white md:box-border md:caret-black md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[3.35544e+07px]">
               <div className="static box-content caret-black outline-black pointer-events-auto rounded-none inset-auto md:absolute md:aspect-auto md:box-border md:caret-black md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:pointer-events-none md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:border md:border-stone-200 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[3.35544e+07px] md:border-solid md:inset-0"></div>
               <div className="static [align-items:normal] box-content caret-black block h-auto outline-black w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-black md:flex md:h-full md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                 <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto p-0 md:relative md:items-center md:aspect-auto md:box-border md:caret-black md:gap-x-[5.376px] md:flex md:justify-start md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[5.376px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:pl-4 md:pr-[10.624px] md:py-[12.416px] md:scroll-m-0 md:scroll-p-[auto]">
                   <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block basis-auto grow-0 shrink justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] md:relative md:items-center md:aspect-auto md:box-border md:caret-black md:gap-x-[8.832px] md:flex md:basis-0 md:grow md:shrink-0 md:justify-center md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                     <input
                       type="email"
                       placeholder="example@mail.com"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="text-[13.3333px] normal-nums bg-white box-content caret-black inline-block basis-auto grow-0 leading-[normal] min-h-0 min-w-0 outline-black text-start focus:outline-none md:text-[13.32px] md:aspect-auto md:bg-transparent md:box-border md:caret-black md:block md:basis-0 md:grow md:leading-[19.536px] md:min-h-px md:min-w-px md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto]"
                     />
                   </div>
                 </div>
               </div>
             </div>
           </div>
           <button
             type="button"
             onClick={submit}
             disabled={loading || !canSubmit}
              className="static bg-zinc-100 caret-black inline-block shrink min-h-0 min-w-0 outline-black w-auto rounded-none md:relative md:aspect-auto md:bg-transparent md:caret-black md:block md:shrink-0 md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:p-0 md:scroll-m-0 md:scroll-p-[auto] md:rounded-[31.104px]"
            >
              <div className="static [align-items:normal] box-content caret-black block h-auto justify-normal outline-black w-auto md:relative md:items-center md:aspect-auto md:box-border md:caret-transparent md:flex md:h-full md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:overflow-clip md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                <div className="static [align-items:normal] box-content caret-black gap-x-[normal] block justify-normal min-h-0 min-w-0 outline-black gap-y-[normal] w-auto p-0 md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.88px] md:flex md:justify-center md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.88px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:w-full md:[mask-position:0%] md:bg-left-top md:px-[35.52px] md:py-[8.88px] md:scroll-m-0 md:scroll-p-[auto]">
                  <div className="[align-items:normal] self-auto box-content caret-black block min-h-0 min-w-0 outline-black md:items-center md:self-stretch md:aspect-auto md:box-border md:caret-transparent md:flex md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                    <div className="box-content caret-black min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                      <div className="[align-items:normal] box-content caret-black gap-x-[normal] block h-auto justify-normal outline-black gap-y-[normal] md:items-center md:aspect-auto md:box-border md:caret-transparent md:gap-x-[8.832px] md:flex md:h-full md:justify-center md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:gap-y-[8.832px] md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                        <div className="text-base normal-nums font-normal box-content caret-black block flex-row justify-normal tracking-[normal] min-h-0 min-w-0 outline-black normal-case md:text-[13.32px] md:font-semibold md:aspect-auto md:box-border md:caret-transparent md:flex md:flex-col md:justify-center md:tracking-[0.1332px] md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:uppercase md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                          <p className="box-content caret-black min-h-0 min-w-0 outline-black md:aspect-auto md:box-border md:caret-transparent md:min-h-[auto] md:min-w-[auto] md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto]">
                            {loading ? "SENDING..." : "GET GUIDE"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="static box-content caret-black outline-black pointer-events-auto rounded-none inset-auto md:absolute md:aspect-auto md:box-border md:caret-transparent md:outline-[oklab(0.708_0_0_/_0.5)] md:overscroll-x-auto md:overscroll-y-auto md:pointer-events-none md:snap-align-none md:snap-normal md:snap-none md:decoration-auto md:underline-offset-auto md:border md:border-orange-600 md:[mask-position:0%] md:bg-left-top md:scroll-m-0 md:scroll-p-[auto] md:rounded-[31.104px] md:border-solid md:inset-0"></div>
            </button>

            {success ? <div className="text-sm text-green-700">{success}</div> : null}
            {error ? <div className="text-sm text-red-600">{error}</div> : null}
          </div>
        </div>
      </div>
    </div>
  );
};
