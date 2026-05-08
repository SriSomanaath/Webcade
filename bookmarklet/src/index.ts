import { startRuntime, type GameModule } from "./runtime";
import { brickout } from "./games/brickout";
import { snake } from "./games/snake";
import { whack } from "./games/whack";
import { raiders } from "./games/raiders";
import { taxi } from "./games/taxi";

const registry: Record<string, GameModule> = {
  brickout,
  snake,
  "whack-the-page": whack,
  "page-raiders": raiders,
  "page-taxi": taxi,
};

const requested =
  (window as unknown as { __webcade_game?: string }).__webcade_game ?? "brickout";
startRuntime(registry[requested] ?? brickout);
