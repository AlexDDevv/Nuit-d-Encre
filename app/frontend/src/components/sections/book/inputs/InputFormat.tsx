import ErrorInput from '@/components/UI/form/ErrorInput'
import { Label } from '@/components/UI/form/Label'
import TypeSelect from '@/components/UI/form/TypeSelect'
import { FormatInputProps } from '@/types/types'

const formatOptions = [
    { label: "Relié", value: "hardcover" },
    { label: "Broché", value: "paperback" },
    { label: "Couverture souple", value: "softcover" },
    { label: "Livre de poche", value: "pocket" },
]

export default function InputFormat({ control, errors }: FormatInputProps) {
    return (
        <div className="flex flex-col gap-1 w-1/2">
            <div className="flex flex-col gap-2">
                <Label htmlFor="format" required>
                    Format d'ouvrage
                </Label>
                <TypeSelect
                    control={control}
                    name="format"
                    message="Le format du livre est requis"
                    selectSomething="Sélectionner un format"
                    options={formatOptions}
                />
            </div>
            {errors.format?.message && (
                <ErrorInput message={errors.format.message} />
            )}
        </div>
    )
}
