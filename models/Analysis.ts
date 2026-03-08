import mongoose from "mongoose";

const FlagSchema = new mongoose.Schema(
  {
    phrase: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high"], required: true },
    reason: { type: String, required: true },
  },
  { _id: false },
);

const ParsedTradeSchema = new mongoose.Schema(
  {
    ticker: { type: String, required: true },
    companyName: String,
    assetType: { type: String, enum: ["stock", "option"], required: true },
    strategyType: {
      type: String,
      enum: ["long_stock", "short_stock", "long_call", "long_put"],
      required: true,
    },
    direction: { type: String, enum: ["bullish", "bearish"], required: true },
    capital: { type: Number, required: true },
    horizonDays: { type: Number, required: true },
    strikePrice: Number,
    currentPrice: Number,
    premiumPerContract: Number,
    contracts: Number,
    confidencePhrases: [String],
    assumptions: [String],
  },
  { _id: false },
);

const SimulationSummarySchema = new mongoose.Schema(
  {
    probProfit: Number,
    meanEndingValue: Number,
    medianEndingValue: Number,
    p5: Number,
    p25: Number,
    p75: Number,
    p95: Number,
    maxLoss: Number,
    maxGain: Number,
  },
  { _id: false },
);

const SimulationResultSchema = new mongoose.Schema(
  {
    summary: { type: SimulationSummarySchema, required: true },
    endingValues: { type: [Number], required: true },
    samplePaths: { type: [[Number]], required: true },
  },
  { _id: false },
);

const AnalysisSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    rawText: { type: String, required: true },
    parsedTrade: { type: ParsedTradeSchema, required: true },
    flags: { type: [FlagSchema], default: [] },
    explanation: { type: String, required: true },
    simulationResult: SimulationResultSchema,
  },
  { timestamps: true }, // adds createdAt + updatedAt
);

export default mongoose.models.Analysis ||
  mongoose.model("Analysis", AnalysisSchema);
