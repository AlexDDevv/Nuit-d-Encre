import ErrorInput from '@/components/UI/form/ErrorInput'
import { Label } from '@/components/UI/form/Label'
import TypeSelect from '@/components/UI/form/TypeSelect'
import { CategoryInputProps } from '@/types/types'

export default function InputCategory({ control, categoryOptions, loadingCategories, errors }: CategoryInputProps) {
    return (
        <div className="flex flex-col gap-1 w-1/2">
            <div className="flex flex-col gap-2">
                <Label htmlFor="category" required>
                    Catégorie
                </Label>
                <TypeSelect
                    control={control}
                    name="category"
                    message="La catégorie est requise"
                    selectSomething="Sélectionner une catégorie"
                    options={categoryOptions}
                    disabled={loadingCategories}
                />
            </div>
            {errors.category?.message && (
                <ErrorInput message={errors.category.message} />
            )}
        </div>
    )
}
