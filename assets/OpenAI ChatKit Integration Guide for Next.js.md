# OpenAI ChatKit Integration Guide for Next.js

This document provides a comprehensive guide for integrating OpenAI ChatKit into a Next.js App Router project. It covers the authoritative instructions and exact request/response shapes needed to implement a backend endpoint that returns a ChatKit `client_secret` to the browser without exposing the OpenAI API key.

## Recommendation: Managed vs. Self-Hosted Backend

For a small Next.js marketing or e-commerce site, the **recommended approach is the managed backend** (OpenAI-hosted). This method offers the fastest setup and lowest operational burden, allowing you to leverage OpenAI's infrastructure for hosting and scaling the chat backend. [1]

Here is a comparison of the two approaches:

| Feature | Managed Backend (Recommended) | Self-Hosted Backend |
| :--- | :--- | :--- |
| **Best For** | Fastest setup with OpenAI-managed infrastructure | Maximum control, custom workflows, and proprietary data paths |
| **Chat Server** | Hosted by OpenAI | Hosted by you |
| **Data Storage** | Messages and attachments stored by OpenAI | Stored in your own database and file storage |
| **Authentication** | Your server mints short-lived ChatKit client secrets | Your server injects auth headers for ChatKit requests |
| **Inference** | Agent Builder workflows | Agents SDK or custom implementation |
| **Customization** | Full UI customization | Full UI and backend customization |
| **Operational Burden** | Minimal | High |

Given the context of a small marketing or e-commerce site, the managed approach provides all the necessary features with significantly less development and maintenance overhead. You can find more details in the [ChatKit.js documentation](https://openai.github.io/chatkit-js/). [2]

## Implementation Specification for `POST /api/chatkit/secret`

This section details the implementation of a Next.js API route at `POST /api/chatkit/secret` to create a ChatKit session and return a `client_secret`.

### Environment Variables

Your Next.js backend will require the following environment variables:

| Variable | Description |
| :--- | :--- |
| `OPENAI_API_KEY` | Your OpenAI API key. |
| `CHATKIT_WORKFLOW_ID` | The ID of the workflow created in Agent Builder (e.g., `wf_...`). |

### Upstream OpenAI API Call

Your backend endpoint will make a `POST` request to the OpenAI API to create a ChatKit session.

**Endpoint:** `POST https://api.openai.com/v1/chatkit/sessions` [3]

**Headers:**

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_OPENAI_API_KEY",
  "OpenAI-Beta": "chatkit_beta=v1"
}
```

**Request Body:**

The request body must include the `workflow` ID and a `user` identifier.

```json
{
  "workflow": {
    "id": "YOUR_CHATKIT_WORKFLOW_ID"
  },
  "user": "ANONYMOUS_USER_ID"
}
```

### Frontend Response Shape

Your `/api/chatkit/secret` endpoint should return the following JSON object to the frontend:

```json
{
  "client_secret": "...",
  "expires_after": ...
}
```

This is the format expected by the ChatKit frontend library. [4]

## Next.js Route Handler Implementation

Below is a copy-pastable implementation for a Next.js App Router Route Handler. This code handles the creation of a ChatKit session, including robust error handling and secure user identification using cookies.

This implementation is based on the official OpenAI ChatKit starter application. [5]

```typescript
// app/api/chatkit/secret/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const { workflow_id } = await req.json();

  if (!workflow_id) {
    return NextResponse.json({ error: 'Missing workflow_id' }, { status: 400 });
  }

  const cookieStore = cookies();
  let userId = cookieStore.get('chatkit_session_id')?.value;

  if (!userId) {
    userId = uuidv4();
    cookieStore.set('chatkit_session_id', userId, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chatkit/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'OpenAI-Beta': 'chatkit_beta=v1',
      },
      body: JSON.stringify({
        workflow: { id: workflow_id },
        user: userId,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error creating ChatKit session:', errorData);
      return NextResponse.json(
        { error: errorData.error || 'Failed to create ChatKit session' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ client_secret: data.client_secret, expires_after: data.expires_after });

  } catch (error) {
    console.error('Error reaching OpenAI API:', error);
    return NextResponse.json({ error: 'Failed to reach OpenAI API' }, { status: 502 });
  }
}
```

## Token Refresh Behavior

The ChatKit frontend library automatically handles token refresh. When a `client_secret` is about to expire, the `getClientSecret` function you provide to the `useChatKit` hook is called with the expired token. Your implementation should then fetch a new `client_secret` from your backend. It is important to note that there is no dedicated refresh endpoint; a new session is created each time. [6]

## References

[1] [OpenAI ChatKit Documentation](https://platform.openai.com/docs/guides/chatkit)
[2] [ChatKit.js Documentation](https://openai.github.io/chatkit-js/)
[3] [OpenAI API Reference - ChatKit](https://platform.openai.com/docs/api-reference/chatkit)
[4] [HostedApiConfig Documentation](https://openai.github.io/chatkit-js/api/openai/chatkit/type-aliases/hostedapiconfig/)
[5] [OpenAI ChatKit Starter App](https://github.com/openai/openai-chatkit-starter-app)
[6] [Advanced integrations with ChatKit](https://platform.openai.com/docs/guides/custom-chatkit)
