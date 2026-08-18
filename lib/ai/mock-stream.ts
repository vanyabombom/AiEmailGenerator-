import { EmailGenerateConfig } from "@/types";

export function generateMockEmailContent(config: EmailGenerateConfig): string {
  const { topic, tone, length, recipientName, senderName, additionalContext } = config;
  const isRussian = /[а-яА-ЯёЁ]/.test(topic + (additionalContext || "") + (recipientName || "") + (senderName || ""));
  
  const recipient = recipientName || (isRussian ? "коллега" : "there");
  const sender = senderName || (isRussian ? "С уважением,\nАлекс" : "Best regards,\nAlex");
  const contextNote = additionalContext
    ? `\n\n${isRussian ? "Дополнительный контекст:" : "Context Note:"} ${additionalContext}`
    : "";

  if (isRussian) {
    switch (tone) {
      case "professional":
        return `Тема: Важно: ${topic}

Уважаемый(ая) ${recipient},

Надеюсь, у вас всё хорошо.

Обращаюсь к вам по поводу ${topic}. Мы проанализировали текущие задачи и хотели бы согласовать ключевые шаги для успешной реализации.

Основные моменты:
- Четкий график выполнения и регулярные статусы.
- Оптимальное распределение ресурсов по приоритетным направлениям.
- Следующие шаги запланированы на начало следующей недели.${contextNote}

Пожалуйста, сообщите, когда вам будет удобно созвониться на 10 минут для обсуждения деталей.

${sender}`;

      case "casual":
        return `Тема: Коротко по поводу ${topic} 👋

Привет, ${recipient}!

Надеюсь, неделя проходит отлично!

Хотел(а) быстро связаться по поводу ${topic}. Думаю, нам стоит оперативно сверкаться, чтобы двигаться дальше без задержек.

Дай знать, когда тебе удобно обсудить!${contextNote}

С наилучшими пожеланиями,
${sender.replace("С уважением,\n", "")}`;

      case "persuasive":
      case "sales":
        return `Тема: Отличная возможность: ${topic} 🚀

Здравствуйте, ${recipient}!

Хотите повысить эффективность и отклик вашей команды в этом квартале?

С помощью ${topic} мы помогаем компаниям увеличивать продуктивность в 2-3 раза и сокращать время на рутину.

Почему это актуально прямо сейчас:
1. Быстрый результат с минимальными усилиями.
2. Готовые решения под ваши задачи.
3. Проверенное повышение конверсии.${contextNote}

Будет ли вам удобно созвониться на 10-минутную демо-презентацию на этой неделе?

${sender}`;

      case "urgent":
        return `Тема: СРОЧНО: Требуется решение по ${topic}

Здравствуйте, ${recipient}!

Пожалуйста, ознакомьтесь с приоритетным вопросом по поводу ${topic} как можно скорее.

Нам необходимо ваше подтверждение, чтобы уложиться в текущий дедлайн. Задержка может повлиять на сроки сдачи проекта.${contextNote}

Жду ответа при первой возможности.

${sender}`;

      case "friendly":
        return `Тема: Хорошего дня! Вопрос по ${topic} 😊

Привет, ${recipient}!

Надеюсь, день проходит замечательно!

Думал(а) о ${topic} и решил(а) написать. Буду рад(а) услышать твои мысли и обсудить, как мы можем сделать это ещё лучше.${contextNote}

На связи!

С наилучшими пожеланиями,
${sender.replace("С уважением,\n", "")}`;

      case "empathetic":
        return `Тема: Касательно ситуации с ${topic}

Уважаемый(ая) ${recipient},

Понимаю, что работа над ${topic} требует больших усилий и внимания.

Мы хотим убедиться, что у вас есть вся необходимая поддержка. Пожалуйста, дайте знать, чем мы можем помочь, чтобы облегчить задачу для вашей команды.${contextNote}

Мы всегда на связи и готовы поддержать.

${sender}`;

      default:
        return `Тема: Детали по проекту: ${topic}

Здравствуйте, ${recipient}!

Направляю вам информацию по поводу ${topic}.

Буду рад(а) ответить на вопросы и согласовать следующие шаги.${contextNote}

${sender}`;
    }
  }

  // English fallback
  switch (tone) {
    case "professional":
      return `Subject: Action Required: ${topic}

Dear ${recipient},

I hope this email finds you well.

I am writing regarding ${topic}. We have reviewed the current objectives and would like to ensure seamless alignment across our deliverables.

Key items to highlight:
- Clear execution timelines and progress updates.
- Strategic resource allocation for high-priority items.
- Next steps scheduled for early next week.${contextNote}

Please let me know your availability for a brief call to finalize these details.

${sender}`;

    case "casual":
      return `Subject: Quick note on ${topic} 👋

Hey ${recipient},

Hope you're having a great week!

Just wanted to touch base regarding ${topic}. I was thinking we could quickly align on this so we can keep things moving smoothly.

Let me know what works for you!${contextNote}

Cheers,
${sender.replace("Best regards,\n", "")}`;

    case "persuasive":
      return `Subject: Unlock huge growth with ${topic} 🚀

Hi ${recipient},

Are you looking to scale efficiency and boost response rates this quarter?

With ${topic}, we have helped teams double their output while cutting preparation time by 75%.

Here is why this matters right now:
1. Instant high-impact results with zero friction.
2. Tailored messaging built specifically for your audience.
3. Proven conversion lift across cold and warm channels.${contextNote}

Would you be open to a 10-minute demo this Thursday?

${sender}`;

    case "urgent":
      return `Subject: URGENT: Action Needed - ${topic}

Hi ${recipient},

Please review this priority item regarding ${topic} as soon as possible.

We require your approval on the proposed items to meet our upcoming deadline today. Delaying beyond 5:00 PM may impact project delivery timelines.${contextNote}

Please reply at your earliest convenience to confirm.

${sender}`;

    case "friendly":
      return `Subject: Hope you're doing well! Quick question about ${topic} 😊

Hi ${recipient},

I hope you're having a wonderful day!

I was reflecting on ${topic} and thought of reaching out. I'd love to hear your thoughts and see how we can collaborate to make this even better.${contextNote}

Looking forward to catching up soon!

Warmly,
${sender.replace("Best regards,\n", "")}`;

    case "empathetic":
      return `Subject: Thinking of your team regarding ${topic}

Dear ${recipient},

I understand that managing ${topic} can be challenging and demanding.

We want to make sure you have all the support and flexibility needed. Please let us know how we can adjust or assist to lighten the load for your team.${contextNote}

We are here for you whenever you're ready.

Warm regards,
${sender}`;

    case "sales":
    default:
      return `Subject: Exclusive opportunity: ${topic} 📈

Hi ${recipient},

I noticed your team is actively expanding, and I wanted to reach out regarding ${topic}.

Our platform helps decision-makers save 15+ hours every week while delivering 3x higher engagement.${contextNote}

Can I send over a quick 2-minute overview video?

Best,
${sender}`;
  }
}
