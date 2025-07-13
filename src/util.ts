type HTMLElementTagNameMap = {
    'header': HTMLElement
    'footer': HTMLElement
    'main': HTMLElement
    'div': HTMLDivElement
    'button': HTMLButtonElement
    'span': HTMLSpanElement
    'ul': HTMLUListElement
    'li': HTMLLIElement
    'h2': HTMLHeadingElement
    'h3': HTMLHeadingElement
    'small': HTMLElement
    'p': HTMLParagraphElement
}

export const createElement = <K extends keyof HTMLElementTagNameMap>(
    tag: K,
    className?: string,
    content?: string
): HTMLElementTagNameMap[K] => {
    const element = document.createElement(tag) as HTMLElementTagNameMap[K]
    if (className !== undefined) {
        element.className = className
    }
    if (content !== undefined) {
        element.textContent = content
    }
    return element
}

export const formatCurrency = (amount: number): string => {
    return amount.toLocaleString()
}