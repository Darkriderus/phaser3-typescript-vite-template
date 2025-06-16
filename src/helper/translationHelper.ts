import de from '../data/de.json'

export const translate = (key: string) => {
    return de.find((item) => item.key === key)?.label || 'KEY_' + key
}