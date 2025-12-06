import { generateText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import { OpenMemory } from "openmemory-js"
import { z } from "zod"
import "dotenv/config"

const mem = new OpenMemory({ mode: "local" })

const main = async () => {
    console.log("adding test memory...")
    await mem.add("user's favorite color is green", { user_id: "u1" })

    const result = await generateText({
        model: openai("gpt-4o"),
        prompt: "what is my favorite color?",
        tools: {
            memory: tool({
                description: "search long term memory",
                parameters: z.object({ query: z.string() }),
                execute: async ({ query }) => {
                    console.log("tool called with:", query)
                    const res = await mem.query(query)
                    return JSON.stringify(res)
                },
            }),
        },
        maxSteps: 5,
    })

    console.log("response:", result.text)
}

main().catch(console.error)
