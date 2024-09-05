import { useState } from 'react';
import { Text, View } from 'react-native';
import { MaskedTextInputProps, MaskedTextInput } from 'react-native-mask-text';

type InputProps = MaskedTextInputProps & {
    title?: string;
    footerTitle?: string;
    mask?: string;
}

export function TextMaskInput({ title, footerTitle, mask, ...rest }: InputProps) {
    const [maskedValue, setMaskedValue] = useState("");
    const [unMaskedValue, setUnmaskedValue] = useState("");

    return (
        <View className="flex items-start justify-center py-2 px-10 gap-1">
            {title && <Text className="text-md">{title}</Text>}
            <MaskedTextInput
                className="w-80 p-2 border-2 border-blue-950 rounded-md text-md"
                mask={mask}
                onChangeText={(text, rawText) => {
                    setMaskedValue(text)
                    setUnmaskedValue(rawText)
                }}
                {...rest}
            />
            {footerTitle && <Text className="text-sm text-gray-400">{footerTitle}</Text>}
        </View>
    )
}