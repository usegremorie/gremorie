import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@gremorie/rx-display';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@gremorie/rx-overlays';

/**
 * Showcase card: a short explainer from a personal-finance learning
 * center, with the key term defined inline.
 */
export function DollarCostAveraging() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Dollar-Cost Averaging</CardTitle>
        <CardDescription>
          A strategy for building wealth over time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Investing the same $200 every month smooths out the{' '}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="cursor-help text-foreground underline decoration-dotted underline-offset-4"
                  type="button"
                >
                  average cost
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Total invested divided by the shares you own.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>{' '}
          of your investments. When prices drop, your fixed amount buys more
          shares. When prices rise, it buys fewer. The result is usually a lower
          cost per share than a single lump-sum purchase during volatile
          periods.
        </p>
      </CardContent>
    </Card>
  );
}
