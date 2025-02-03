import {formatOptions, formatOptionsWithConcatenation} from "@helpers/formatters.js";
import FormAsyncSelect from "@components/form/FormAsyncSelect.jsx";
import React, {useMemo} from "react";
import UserCreateModal from "@components/modals/UserCreateModal.jsx";
import {useOtherUserModal} from "@modules/user/hooks/userHooks.js";

const UserDropdown = ({
                          control,
                          errors,
                          data,
                          multiple = true,
                          dataKey = 'other_users',
                          classes = '',
                          haveLabel = false,
                          name = 'other_users',
                          placeholder = 'External Users',
                          addUser = true,
                          userType = '',
                          onUserSelect
                      }) => {
        const {
            openUserModal,
            closeUserModal,
            userControl,
            userErrors,
            isSubmitting,
            handleSubmit,
            onUserSubmit,
            isUserModalOpen
        }  = useOtherUserModal()

    const formattedUsers = useMemo(() => formatOptionsWithConcatenation(data, dataKey, "id", ['full_name', 'email']), [data]);

    return (

        <>
            <div className={`${addUser ? 'col-span-11' : 'col-span-12'}`}>
                <FormAsyncSelect
                    isMulti={multiple}
                    label={haveLabel}
                    name={name}
                    control={control}
                    errors={errors}
                    placeholder={placeholder}
                    apiUrl={`/select/user/customers/?type=${userType}`}
                    queryKeyBase={`external_users_${userType}`}
                    preselectedOptions={formattedUsers}
                    className={classes}
                    onSelectChange={onUserSelect}
                />
            </div>
            {
                addUser && (
                <div className="col-span-1 flex justify-end items-center">
                    <button type='button'  onClick={() => openUserModal()}
                        className="ti-btn ti-btn-success !py-1 !px-2 !font-medium !text-[0.75rem] bg-white dark:bg-bodybg text-default border-0">
                        <i className="ri-add-line"></i>
                    </button>
                </div>
            )}

            {
                addUser && isUserModalOpen &&
                (
                    <UserCreateModal
                        control={userControl}
                        errors={userErrors}
                        isSubmitting={isSubmitting}
                        handleSubmit={handleSubmit}
                        onSubmit={onUserSubmit}
                        closeModal={closeUserModal}
                    />
                )
            }
        </>

    )
}
export default React.memo(UserDropdown);