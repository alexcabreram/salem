<img src="public/salem-mark.svg" width="72" alt="SALEM mark: a cat's head drawn as a window, its eyes closed in a slow blink">

# SALEM

### One intelligence. Everywhere you are.

SALEM explores a future where personal AI is no longer confined to a chat window.

It is a persistent personal intelligence, a familiar for your digital life: it keeps context about the people, projects, devices and services in
your life, and acts across them. Models, agents and tools are parts SALEM uses. SALEM is what stays.

Website: [getsalem.dev](https://getsalem.dev)

## Principles

- **Persistent.** Context survives individual conversations.
- **Provider-agnostic.** No single AI provider owns the intelligence layer.
- **Local-first where useful.** Sensitive work can stay on hardware you control.
- **Observable.** Model choices and actions can be inspected after the fact.
- **User-controlled.** You can see what SALEM knows and what it can reach.
- **Extensible.** Tools, agents and providers are modules, not foundations.

## Architecture

```
            Interfaces
   Messaging · Web · Voice · Desktop
                 │
               SALEM
     Context, memory, orchestration
                 │
     ┌───────────┼───────────┐
   Models      Agents       Tools
   Claude,     Research,    MCP,
   Azure,      coding,      APIs,
   local       infra        CLI
                 │
          Local + Cloud
```

## Current state

SALEM is early stage and built in public by one person. Each capability is marked honestly:

| Capability | Status |
|---|---|
| Messaging interface | Running today, in the founder's own setup |
| Local and cloud models (chosen by configuration) | Running today, in the founder's own setup |
| Tools via MCP, APIs and CLI | In development |
| Infrastructure actions | In development |
| SALEM World (inspectable persistent context) | Exploring |
| Automatic model routing | Next |
| Voice, devices, telephony | Exploring |

Nothing here is a product you can install yet.

## Roadmap

- **Now:** architecture, local and cloud foundation, agent experiments, MCP and tool integration, multi-model experiments.
- **Next:** SALEM World, persistent context, model routing, voice, infrastructure actions.
- **Later:** proactive intelligence, distributed agents, telephony, presence across devices, third-party extensions.

## This repository

The public website and documentation for SALEM.

```bash
npm install
npm run dev      # local development
npm run build    # static output in dist/
```

Built with [Astro](https://astro.build). Deployed on Cloudflare Pages.

## Contact

Alex Cabrera · [hello@getsalem.dev](mailto:hello@getsalem.dev) · [LinkedIn](https://www.linkedin.com/in/alexcabreram/)
