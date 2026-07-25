import { useState } from "react";
import emailjs from "@emailjs/browser";
import { z } from "zod";

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const contactSchema = z.object({
    name: z.string().min(1, "Please enter your name."),
    email: z.string().email("Please enter a valid email address."),
    title: z.string().min(1, "Please enter a subject."),
    message: z.string().min(1, "Please enter a message."),
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    title: "",
    message: "",
  });

  const [status, setStatus] = useState({
    type: "",
    title: "",
    message: "",
  });

  const validateField = (name, value) => {
    try {
      contactSchema.shape[name].parse(value);
      return "";
    } catch (error) {
      return error.issues?.[0]?.message || "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = contactSchema.safeParse(formData);

    if (!result.success) {
      const nextErrors = {
        name: "",
        email: "",
        title: "",
        message: "",
      };

      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (fieldName in nextErrors) {
          nextErrors[fieldName] = issue.message;
        }
      });

      setErrors(nextErrors);
      return;
    }

    setErrors({
      name: "",
      email: "",
      title: "",
      message: "",
    });

    setStatus({
      type: "",
      title: "",
      message: "",
    });

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    setLoading(true);

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          name: formData.name,
          email: formData.email,
          title: formData.title,
          message: formData.message,
        },
        publicKey
      );

      setStatus({
        type: "success",
        title: "Message Sent",
        message: "Your message has been successfully delivered.",
      });

      setFormData({
        name: "",
        email: "",
        title: "",
        message: "",
      });
    } catch (error) {
      console.error("EmailJS send failed:", error);

      setStatus({
        type: "error",
        title: "Delivery Failed",
        message:
          error?.text || "Something went wrong while sending your message.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full px-3 py-2 outline-none font-ui text-black ${
      hasError ? "border-2 border-win-red bg-[#fff0f0]" : "win-sink bg-white"
    }`;

  return (
    <div className="win-raise flex min-h-full w-full flex-col bg-win-face p-4 sm:p-6">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="flex min-h-0 flex-1 flex-col gap-4"
      >
        <div>
          <label className="mb-1 block font-ui text-sm">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClass(!!errors.name)}
          />
          {errors.name && (
            <p className="mt-1 font-ui text-xs text-win-red">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-ui text-sm">Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass(!!errors.email)}
          />
          {errors.email && (
            <p className="mt-1 font-ui text-xs text-win-red">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-ui text-sm">Subject</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={inputClass(!!errors.title)}
          />
          {errors.title && (
            <p className="mt-1 font-ui text-xs text-win-red">{errors.title}</p>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <label className="mb-1 block font-ui text-sm">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className={`${inputClass(
              !!errors.message
            )} min-h-[120px] flex-1 resize-none`}
          />
          {errors.message && (
            <p className="mt-1 font-ui text-xs text-win-red">{errors.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          onClick={() =>
            setStatus({
              type: "",
              title: "",
              message: "",
            })
          }
          className="win-btn w-fit cursor-pointer px-5 py-2 font-ui font-bold text-black active:win-pressed disabled:opacity-60"
        >
          {loading ? "Transmitting..." : "Send Message"}
        </button>
      </form>

      {status.message && (
        <div className="win-raise mt-4 shrink-0 overflow-hidden">
          <div
            className={`px-3 py-1.5 font-ui text-sm font-semibold text-white ${
              status.type === "success" ? "bg-win-green" : "bg-win-red"
            }`}
          >
            {status.title}
          </div>

          <div className="flex items-center gap-3 bg-win-face p-4">
            <div
              className={`win-sink flex h-8 w-8 items-center justify-center font-bold ${
                status.type === "success" ? "bg-[#b7f3b7]" : "bg-[#f3b7b7]"
              }`}
            >
              {status.type === "success" ? "✓" : "!"}
            </div>

            <p className="font-ui text-sm text-black">{status.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
