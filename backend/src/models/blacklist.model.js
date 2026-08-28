import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  { timestamps: true },
);

const TokenBlacklist = mongoose.model("TokenBlacklist", blacklistTokenSchema);

export default TokenBlacklist;
