import { Reward } from "@/types/reward";

import { formatISODateToReadable } from "@/lib/utils";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function RewardInfo({ reward }: { reward: Reward }) {
  return (
    <div className="flex flex-col items-center">
      <div className="mx-3 w-full">
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Costs</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row gap-1">
                <p className="text-3xl">{reward?.cost}</p>
                <p className="self-end">Points</p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Description</AccordionTrigger>
            <AccordionContent>
              <p>{reward?.description}</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>Timestamps</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-row items-center justify-center gap-5">
                <div className="flex flex-col items-center">
                  <h1 className="text-sm font-bold">Created At</h1>
                  <p className="text-center">{formatISODateToReadable(reward?.createdAt)}</p>
                </div>
                <div className="flex flex-col items-center">
                  <h1 className="text-sm font-bold">Updated At</h1>
                  <p>{formatISODateToReadable(reward?.updatedAt)}</p>
                </div>
                {reward.redeemed && (
                  <div className="flex flex-col items-center">
                    <h1 className="text-sm font-bold">Redeemed At</h1>
                    <p>{formatISODateToReadable(reward?.redeemedAt)}</p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
