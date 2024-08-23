import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn, getAccountName } from "@/lib/utils";
import { is } from "@/pages/_app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FiPlus } from "react-icons/fi";
import { BANKS, INITIAL_STATE } from "@/constants/constants";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEvent } from "@/lib/firebase";

const NewEvent = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_STATE);

  const updateFormData = (text: string | boolean, which: string) => {
    setFormData((k) => {
      return { ...k, [which]: text };
    });
  };

  const getAccountNameFromAPI = async () => {
    setIsLoading(true);

    const { data, error } = await getAccountName(
      formData.account_number,
      formData.bank_code
    );

    setIsLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    updateFormData(data, "account_name");
  };

  const saveEvent = async () => {
    setLoading(true);

    const { error } = await createEvent(formData);

    setLoading(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success("Event created.");
    setOpen(false);
  };

  useEffect(
    () => updateFormData("", "account_name"),
    [formData.account_number, formData.bank_code]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="bg-main font-normal text-white w-full max-w-[10rem] hover:bg-main/90 flex items-center justify-center gap-2">
          <FiPlus className="text-lg" />
          New event
        </Button>
      </DialogTrigger>
      <DialogContent className={cn("w-full border", is.className)}>
        <DialogHeader>
          <DialogTitle>New event</DialogTitle>
          <DialogDescription className="text-firebase-orange">
            Fill in the details of your event
          </DialogDescription>
        </DialogHeader>

        <div className="w-full max-h-[32rem] py-2 overflow-scroll text">
          <label className="inline-flex mt-4 items-center cursor-pointer self-start">
            <Switch
              checked={formData.public}
              onCheckedChange={(e) => updateFormData(e, "public")}
              className="data-[state=checked]:bg-main"
            />
            <span className="ms-3">Set as public</span>
          </label>

          <p className="mb-1 mt-4">Event name *</p>
          <Input
            onChange={(e) => updateFormData(e.target.value, "name")}
            value={formData.name}
            placeholder="Event name"
          />

          <p className="mb-1 mt-4">Event description *</p>
          <textarea
            onChange={(e) => updateFormData(e.target.value, "description")}
            value={formData.description}
            placeholder="Event description"
            className="w-full border-2 focus-within:border-blue px-3 py-2 rounded-lg"
          />

          {formData.image ? (
            <div className="w-full sm:w-1/2 mt-2">
              <img
                src={formData.image}
                alt="Event image"
                className="w-full object-cover rounded-lg"
              />
              <button
                className="mt-2 rounded-lg bg-blue text-white py-1 px-2 text-sm"
                onClick={() => {
                  updateFormData("", "image");
                }}
              >
                Replace banner
              </button>
            </div>
          ) : (
            <>
              <p className="mt-2 mb-1">Event banner</p>
              <Input
                type="file"
                accept=".png,.jpg,.webp,.jpeg"
                onChange={(e) => {
                  const file = e.target.files![0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    updateFormData(reader.result as string, "image");
                  };

                  reader.readAsDataURL(file);
                }}
              />
            </>
          )}

          <label className="inline-flex mt-4 items-center cursor-pointer self-start">
            <span className="me-3">Physical</span>
            <Switch
              checked={formData.type === "virtual"}
              onCheckedChange={(e) =>
                updateFormData(e ? "virtual" : "physical", "type")
              }
              className="data-[state=checked]:bg-main"
            />
            <span className="ms-3">Virtual</span>
          </label>

          {formData.type === "physical" ? (
            <>
              <p className="mb-1 mt-4">Event location *</p>
              <Input
                onChange={(e) => updateFormData(e.target.value, "location")}
                value={formData.location}
                placeholder="Event location"
              />
            </>
          ) : (
            <>
              <p className="mb-1 mt-4">Event link *</p>
              <Input
                onChange={(e) => updateFormData(e.target.value, "link")}
                value={formData.link}
                placeholder="Event link"
              />
            </>
          )}

          <p className="mb-1 mt-4">Event date and time *</p>
          <input
            type="datetime-local"
            onChange={(e) => updateFormData(e.target.value, "date_time")}
            value={formData.date_time}
            className="flex h-10 w-full rounded-lg border-2 focus-within:border-blue border-input bg-background px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          />

          {/* <p className="mb-1 mt-4">Custom URL</p>
          <Input
            onChange={(e) => updateFormData(e.target.value, "slug")}
            value={formData.slug}
            placeholder="Custom URL"
          /> */}

          <p className="mb-1 mt-4">Support email *</p>
          <Input
            onChange={(e) => updateFormData(e.target.value, "support_email")}
            value={formData.support_email}
            placeholder="Support email"
            type="email"
          />

          <p className="mt-4">Number of available tickets</p>
          <p className="mb-1 text-sm text-gray-400 italic">
            Leave blank for an event with unlimited tickets
          </p>
          <Input
            onChange={(e) => updateFormData(e.target.value, "no_of_tickets")}
            placeholder="Number of tickets"
            value={formData.no_of_tickets}
            type="number"
          />

          <label className="inline-flex mt-4 items-center cursor-pointer self-start">
            <span className="me-3">Free</span>
            <Switch
              checked={!formData.is_free}
              onCheckedChange={(e) => updateFormData(!e, "is_free")}
              className="data-[state=checked]:bg-main"
            />
            <span className="ms-3">Paid</span>
          </label>

          {!formData.is_free && (
            <>
              <p className="mt-4">Price per ticket *</p>
              <p className="mb-1 text-sm text-gray-400 italic">
                A 4% fee is passed on to the buyer (min. ₦100, max. ₦1000)
              </p>
              <Input
                onChange={(e) =>
                  updateFormData(e.target.value, "price_per_ticket")
                }
                placeholder="Price per ticket"
                value={formData.price_per_ticket}
                type="number"
              />

              <div className="w-full flex flex-col sm:flex-row gap-4 mt-4">
                <div className="w-full sm:w-1/2">
                  <p className="mb-1">Account number *</p>
                  <Input
                    onChange={(e) =>
                      updateFormData(
                        e.target.value.replace(" ", ""),
                        "account_number"
                      )
                    }
                    placeholder="Account number"
                    value={formData.account_number}
                  />
                </div>

                <div className="w-full sm:w-1/2">
                  <p className="mb-1">Bank name *</p>
                  <Select
                    onValueChange={(e) => updateFormData(e, "bank_code")}
                    value={formData.bank_code}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a bank" />
                    </SelectTrigger>
                    <SelectContent className={cn("border", is.className)}>
                      <SelectGroup>
                        <SelectLabel>Banks</SelectLabel>
                        {BANKS.map((b, i) => (
                          <SelectItem
                            value={b.code}
                            key={i}
                            className="cursor-pointer"
                          >
                            {b.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.account_name ? (
                <p className="mb-1 mt-4">
                  Account name:{" "}
                  <span className="font-medium">{formData.account_name}</span>
                </p>
              ) : (
                <Button
                  disabled={isLoading}
                  onClick={getAccountNameFromAPI}
                  className="w-full mt-4 bg-main hover:bg-main/90 py-2.5 text-white rounded-md disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  Get account name{" "}
                  {isLoading && (
                    <AiOutlineLoading3Quarters className="animate-spin" />
                  )}
                </Button>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button
            className="bg-main font-normal text-white w-full max-w-[10rem] hover:bg-main/90 gap-2"
            disabled={loading}
            onClick={saveEvent}
          >
            {loading && <AiOutlineLoading3Quarters className="animate-spin" />}
            Create event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewEvent;
