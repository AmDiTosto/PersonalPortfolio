import { useState } from "react";
import emailjs from "@emailjs/browser";
import { z } from "zod";

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const contactSchema = z.object({
    name: z.string().min(1, "Please enter your name."),
    email: z
      .string()
      .min(1, "Please enter your email.")
      .email("Please enter a valid email address."),
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

    setLoading(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          name: formData.name,
          email: formData.email,
          title: formData.title,
          message: formData.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
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
      console.error(error);

      setStatus({
        type: "error",
        title: "Delivery Failed",
        message: "Something went wrong while sending your message.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError) =>
    `w-full px-3 py-2 outline-none border-2 font-fixedsys ${
      hasError
        ? "border-[#aa0000] bg-[#fff0f0] text-black"
        : "border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-white text-black"
    }`;

  return (
    <div className="w-full max-w-2xl border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] bg-[#c3c7cb] p-5 shadow-[2px_2px_0_#000]">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <div>
          <label className="mb-1 block font-fixedsys text-sm">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={inputClass(!!errors.name)}
          />
          {errors.name && (
            <p className="mt-1 font-fixedsys text-xs text-[#aa0000]">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-fixedsys text-sm">Email</label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass(!!errors.email)}
          />
          {errors.email && (
            <p className="mt-1 font-fixedsys text-xs text-[#aa0000]">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-fixedsys text-sm">Subject</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={inputClass(!!errors.title)}
          />
          {errors.title && (
            <p className="mt-1 font-fixedsys text-xs text-[#aa0000]">
              {errors.title}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1 block font-fixedsys text-sm">Message</label>
          <textarea
            name="message"
            rows="6"
            value={formData.message}
            onChange={handleChange}
            className={inputClass(!!errors.message)}
          />
          {errors.message && (
            <p className="mt-1 font-fixedsys text-xs text-[#aa0000]">
              {errors.message}
            </p>
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
          className="w-fit border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] bg-[#d9d9d9] px-4 py-2 font-fixedsys cursor-pointer"
        >
          {loading ? "Transmitting..." : "Send Message"}
        </button>
      </form>

      {status.message && (
        <div className="mt-6 border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] shadow-[2px_2px_0_#000]">
          <div
            className={`px-3 py-1 font-fixedsys text-white ${
              status.type === "success" ? "bg-[#008000]" : "bg-[#aa0000]"
            }`}
          >
            {status.title}
          </div>

          <div className="flex items-center gap-3 bg-[#d9d9d9] p-4">
            <div
              className={`flex h-8 w-8 items-center justify-center border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white font-bold ${
                status.type === "success" ? "bg-[#b7f3b7]" : "bg-[#f3b7b7]"
              }`}
            >
              {status.type === "success" ? "✓" : "!"}
            </div>

            <p className="font-fixedsys text-sm text-black">{status.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}
