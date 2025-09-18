import React, { useState, useEffect } from "react";
import FormInput from "@components/form/FormInput.jsx";
import FormTextarea from "@components/form/FormTextarea.jsx";
import FormButton from "@components/form/FormButton.jsx";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import {HardDrive, PlusCircle, Search, X, Package2, Calculator, ShoppingCart, Check} from "lucide-react";
import {useCivilBoqForm} from "@modules/civil_mgmt/boq/hooks/useCivilBoqForm.js";
import {formatAmountWithCommas, formatOptions} from "@helpers/formatters.js";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import { useQuery } from "@tanstack/react-query";
import api from "@config/axiosConfig.js";
import GalleryUpload from "@components/GalleryUpload.jsx";

const useCategories = () => {
    return useQuery({
        queryKey: ['civil-categories-with-count'],
        queryFn: async () => {
            const { data } = await api.get('/civil/boqs/categories-with-count/');
            return data.data;
        }
    });
};

const useItems = (categoryId, searchTerm = '') => {
    return useQuery({
        queryKey: ['civil-items', categoryId, searchTerm],
        queryFn: async () => {
            const params = new URLSearchParams({
                category: categoryId,
                search: searchTerm,
                limit: 50
            });
            const { data } = await api.get(`/civil/boqs/items/?${params}`);
            return data.results;
        },
        enabled: !!categoryId
    });
};

const CategoryCard = ({ category, isActive, onClick }) => (
    <div
        className={`group relative p-4 rounded-xl cursor-pointer border transition-all duration-300 hover:shadow-md ${
            isActive
                ? 'border-primary shadow-sm'
                : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
        }`}
        onClick={onClick}
    >
        <div className="flex items-start justify-between">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${isActive ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'}`}>
                        <Package2 size={16} />
                    </div>
                    <h4 className={`font-semibold text-sm ${isActive ? 'text-primary' : 'text-gray-900'}`}>
                        {category.name}
                    </h4>
                </div>
                <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        isActive
                            ? 'bg-primary/10 text-primary'
                            : 'bg-gray-100 text-gray-600'
                    }`}>
                        {category.items_count || 0} items
                    </span>
                </div>
            </div>
        </div>
    </div>
);

const ItemCard = ({ item, onAdd, isAdded }) => (
    <div className="group bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all duration-200">
        <div className="p-4">
            <div className="flex justify-between items-start">
                <div className="flex-1 pr-3">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-mono rounded-md border">
                            {item.item_no}
                        </span>
                        <span className="inline-block w-2 h-2 bg-primary rounded-full"></span>
                    </div>
                    <h5 className="font-semibold text-sm text-gray-900 mb-1">{item.name}</h5>
                    {item.description && (
                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <span className="text-xs font-medium text-gray-500">Unit:</span>
                            <span className="text-xs font-semibold text-gray-700">{item.unit}</span>
                        </div>
                        {item.rate && (
                            <div className="flex items-center gap-1">
                                <span className="text-xs font-medium text-gray-500">Rate:</span>
                                <span className="text-xs font-semibold text-green-600">${item.rate}</span>
                            </div>
                        )}
                    </div>
                </div>
                {
                    !isAdded &&
                    <button
                        onClick={() => onAdd(item)}
                        disabled={isAdded}
                        className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 bg-primary/10 text-primary hover:bg-primary hover:text-white hover:scale-105 active:scale-95`}
                    >
                        <Check size={16}/>
                    </button>
                }
            </div>
        </div>
    </div>
);

const SelectedItemsTable = ({items, onUpdateQuantity, onUpdateRate, onRemove}) => (
    <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                <ShoppingCart size={16}/>
            </div>
            <h3 className="font-semibold text-gray-900">Selected Items</h3>
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                {items.length} items
            </span>
        </div>

        {items.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <div className="p-3 bg-gray-100 text-gray-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Package2 size={24} />
                </div>
                <p className="text-gray-600 font-medium mb-1">No items selected</p>
                <p className="text-sm text-gray-500">Choose items from the categories panel</p>
            </div>
        ) : (
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={item.item} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-mono rounded-md">
                                        {item.code}
                                    </span>
                                    <span className="font-semibold text-sm text-gray-900 truncate">{item.name}</span>
                                </div>
                                <span className="text-xs text-gray-500">Unit: {item.unit}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-500">Quantity</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={item.quantity || ''}
                                        onChange={(e) => onUpdateQuantity(index, parseFloat(e.target.value) || 0)}
                                        className={`w-20 px-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-primary focus:border-primary
                                              ${!item.quantity ? '!border-red' : 'border-gray-300'}`}
                                        placeholder="0"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-500">Rate</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={item.rate || ''}
                                        onChange={(e) => onUpdateRate(index, parseFloat(e.target.value) || 0)}
                                        className={`w-20 px-2 py-1.5 text-sm border rounded-md focus:ring-2 focus:ring-primary focus:border-primary
                                                ${!item.rate ? '!border-red' : 'border-gray-300'}`}
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-medium text-gray-500"></label>
                                    <div className="w-24 text-right text-sm font-semibold text-gray-900 py-1.5">
                                        {formatAmountWithCommas(((item.quantity || 0) * (item.rate || 0)))}
                                    </div>
                                </div>

                                <button
                                    onClick={() => onRemove(index)}
                                    className="p-1.5 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="border border-primary rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 textprimary rounded-lg">
                                <Calculator size={16} />
                            </div>
                            <span className="font-semibold text-gray-900">Grand Total</span>
                        </div>
                        <span className="text-xl font-bold text-blue-600">
                            {formatAmountWithCommas(items.reduce((sum, item) => sum + ((item.quantity || 0) * (item.rate || 0)), 0))}
                        </span>
                    </div>
                </div>
            </div>
        )}
    </div>
);

const CivilBoqForm = ({ editMode = false, boqId = null }) => {
    const {
        control,
        errors,
        handleSubmit,
        onSubmit,
        isSubmitting,
        formData,
        watch,
        setValue
    } = useCivilBoqForm(editMode, boqId);

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categorySearch, setCategorySearch] = useState('');
    const [itemSearch, setItemSearch] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    const formItems = watch('items') || [];

    useEffect(() => {
        if (formItems.length !== selectedItems.length) {
            setSelectedItems(formItems);
        }
    }, [formItems]);

    const { data: categories = [], isLoading: categoriesLoading } = useCategories();
    const { data: items = [], isLoading: itemsLoading } = useItems(selectedCategory?.id, itemSearch);

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(categorySearch.toLowerCase()));

    const handleAddItem = (item) => {
        const newItem = {
            item: item.id,
            code: item.item_no,
            name: item.name,
            unit: item.unit,
            quantity: 1,
            rate: item.rate || 0
        };

        const updatedItems = [...selectedItems, newItem];
        setSelectedItems(updatedItems);
        setValue('items', updatedItems);
    };
    const handleUpdateQuantity = (index, quantity) => {
        const updatedItems = selectedItems.map((item, i) =>
            i === index ? { ...item, quantity } : item
        );
        setSelectedItems(updatedItems);
        setValue('items', updatedItems);
    };

    const handleUpdateRate = (index, rate) => {
        const updatedItems = selectedItems.map((item, i) =>
            i === index ? { ...item, rate } : item
        );
        setSelectedItems(updatedItems);
        setValue('items', updatedItems);
    };

    const handleRemoveItem = (index) => {
        const updatedItems = selectedItems.filter((_, i) => i !== index);
        setSelectedItems(updatedItems);
        setValue('items', updatedItems);
    };

    const isItemAdded = (itemId) => {
        return selectedItems.some(item => item.item === itemId);
    };

    return (
        <>
            <IconPageHeader
                heading={editMode ? "Edit BOQ" : "Create New BOQ"}
                description={editMode ? "Modify existing bill of quantities" : "Build a comprehensive bill of quantities"}
                icon={editMode ? HardDrive : PlusCircle}
            />
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-12 gap-x-6 min-h-screen pb-6">
                        <div className="col-span-12 lg:col-span-8">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">BOQ Information</h3>
                                    <p className="text-sm text-gray-600 mt-1">Enter the basic details for your bill of quantities</p>
                                </div>
                                <div className="p-6">
                                    <div className="grid grid-cols-12 gap-6">
                                        <div className="col-span-12">
                                            <FormAsyncSelect
                                                name="project"
                                                control={control}
                                                errors={errors}
                                                placeholder="Select Project"
                                                apiUrl="/select/civil/projects/?for=boq"
                                                queryKeyBase="civil_boq_projects"
                                                preselectedOptions={formatOptions(formData, 'project_option')}
                                                is_required={true}
                                            />
                                        </div>
                                        <div className="xl:col-span-6 col-span-12">
                                            <FormInput
                                                name="title"
                                                control={control}
                                                errors={errors}
                                                placeholder="BOQ Title"
                                                is_required={true}
                                            />
                                        </div>
                                        <div className="xl:col-span-6 col-span-12">
                                            <FormInput
                                                name="version"
                                                type="number"
                                                control={control}
                                                errors={errors}
                                                placeholder="Version Number"
                                                is_required={true}
                                            />
                                        </div>
                                        <div className="col-span-12">
                                            <FormTextarea
                                                name="description"
                                                control={control}
                                                errors={errors}
                                                placeholder="BOQ Description"
                                                rows={3}
                                                is_required={true}
                                            />
                                        </div>
                                        <div className="col-span-12">
                                            <GalleryUpload
                                                currentValue={formData?.attachments}
                                                files={formData?.attached_attachments}
                                                inputName="attachments"
                                                placeholder="Select Attachments"
                                                control={control}
                                                errors={errors}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Selected Items Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">BOQ Items</h3>
                                            <p className="text-sm text-gray-600 mt-1">Manage quantities and rates for selected items</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm text-gray-500">Total Value</div>
                                            <div className="text-lg font-bold text-blue-600">
                                                {formatAmountWithCommas(selectedItems.reduce((sum, item) => sum + ((item.quantity || 0) * (item.rate || 0)), 0))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <SelectedItemsTable
                                        items={selectedItems}
                                        onUpdateQuantity={handleUpdateQuantity}
                                        onUpdateRate={handleUpdateRate}
                                        onRemove={handleRemoveItem}
                                    />
                                    {errors.items && (
                                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p className="text-red-600 text-sm font-medium">{errors.items.message}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                                    <div className="flex justify-end">
                                        <FormButton isLoading={isSubmitting} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 lg:col-span-4">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
                                    <p className="text-sm text-gray-600 mt-1">Select a category to browse items</p>
                                </div>
                                <div className="p-4">
                                    <div className="relative mb-4">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Search categories..."
                                            value={categorySearch}
                                            onChange={(e) => setCategorySearch(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 focus:bg-white transition-colors"
                                        />
                                    </div>

                                    <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                        {categoriesLoading ? (
                                            <div className="text-center py-8">
                                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                <p className="text-sm text-gray-500 mt-2">Loading categories...</p>
                                            </div>
                                        ) : filteredCategories.length === 0 ? (
                                            <div className="text-center py-8 text-gray-500">
                                                <Package2 className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                                                <p>No categories found</p>
                                            </div>
                                        ) : (
                                            filteredCategories.map((category) => (
                                                <CategoryCard
                                                    key={category.id}
                                                    category={category}
                                                    isActive={selectedCategory?.id === category.id}
                                                    onClick={() => setSelectedCategory(category)}
                                                />
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Items Panel */}
                            {selectedCategory && (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-4">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-semibold text-gray-900">{selectedCategory.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1">Add items to your BOQ</p>
                                    </div>
                                    <div className="p-4">
                                        <div className="relative mb-4">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                placeholder="Search items..."
                                                value={itemSearch}
                                                onChange={(e) => setItemSearch(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-gray-50 focus:bg-white transition-colors"
                                            />
                                        </div>

                                        <div className="space-y-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                            {itemsLoading ? (
                                                <div className="text-center py-8">
                                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                    <p className="text-sm text-gray-500 mt-2">Loading items...</p>
                                                </div>
                                            ) : items.length === 0 ? (
                                                <div className="text-center py-12 text-gray-500">
                                                    <Package2 className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                                                    <p>No items found</p>
                                                </div>
                                            ) : (
                                                items.map((item) => (
                                                    <ItemCard
                                                        key={item.id}
                                                        item={item}
                                                        onAdd={handleAddItem}
                                                        isAdded={isItemAdded(item.id)}
                                                    />
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
        </>
    );
};

export default CivilBoqForm;