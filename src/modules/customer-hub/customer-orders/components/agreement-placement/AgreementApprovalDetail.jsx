import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Target, RefreshCw } from "lucide-react";
import IconPageHeader from "@modules/layouts/includes/IconPageHeader.jsx";
import LoadingSpinner from "@components/LoadingSpinner.jsx";
import EmptyState from "@components/EmptyState.jsx";
import Discussion from "@components/Discussion.jsx";
import AlertModalPortal from "@components/AlertModalPortal.jsx";
import { useGlobalApprovalDetail } from "@modules/approvals/global/hooks/useGlobalApprovalDetail.js";
import useGlobalApproval from "@modules/approvals/global/hooks/useGlobalApproval.js";
import {
  getAgreement,
  getAgreementMentionUsers,
} from "@modules/customer-hub/customer-orders/services/AgreementService.js";
import AgreementPlacementForm from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementPlacementForm.jsx";
import AgreementRequesterDetail from "@modules/customer-hub/customer-orders/components/agreement-placement/AgreementRequesterDetail.jsx";

const getErrMsg = (e) =>
  e?.response?.data?.message ||
  e?.response?.data?.detail ||
  e?.response?.data?.error ||
  e?.message ||
  "Request failed";

const AgreementApprovalDetail = () => {
  const { id } = useParams();
  const {
    data,
    isLoading,
    refetch,
    isRefetching,
    isError,
    error,
  } = useGlobalApprovalDetail(id);

  const [agreement, setAgreement] = useState(null);
  const [loadingAgreement, setLoadingAgreement] = useState(true);
  const [mentionUsers, setMentionUsers] = useState([]);
  const [actionError, setActionError] = useState(null);

  const formRef = useRef(null);
  const currentUser = useSelector((state) => state.auth.user);

  const agreementId = useMemo(() => data?.object_id || null, [data]);

  const loadAgreement = useCallback(async (idToLoad) => {
    if (!idToLoad) return;
    const [ag, users] = await Promise.all([
      getAgreement(idToLoad),
      getAgreementMentionUsers(idToLoad),
    ]);
    setAgreement(ag);
    setMentionUsers(users || []);
  }, []);

  const handleRefetch = useCallback(async () => {
    if (!agreementId) return;
    setLoadingAgreement(true);
    try {
      await loadAgreement(agreementId);
      await refetch();
    } finally {
      setLoadingAgreement(false);
    }
  }, [agreementId, loadAgreement, refetch]);

  const {
    selectedId,
    actionType,
    isModalOpen,
    isSubmitting,
    getModalType,
    getModalTitle,
    getModalMessage,
    getModalButtonText,
    handleActionClick,
    handleSubmit,
    setIsModalOpen,
  } = useGlobalApproval();

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!agreementId) {
        setAgreement(null);
        setMentionUsers([]);
        setLoadingAgreement(false);
        return;
      }
      setLoadingAgreement(true);
      try {
        const [ag, users] = await Promise.all([
          getAgreement(agreementId),
          getAgreementMentionUsers(agreementId),
        ]);
        if (!active) return;
        setAgreement(ag);
        setMentionUsers(users || []);
      } finally {
        if (active) setLoadingAgreement(false);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [agreementId]);

  const approvalType = data?.approval_type?.label || "Approval";
  const approvalDesc = data?.approval_type?.description || "";

  const canTakeAction =
    typeof data?.can_take_action === "boolean"
      ? data.can_take_action
      : currentUser?.id === data?.current_approver?.id;

  const handleApproveClick = () => {
    if (!data) return;
    setActionError(null);
    handleActionClick(data.id, "approved", data.approval_type.label);
  };

  const handleRejectClick = () => {
    if (!data) return;
    setActionError(null);
    handleActionClick(data.id, "rejected", data.approval_type.label);
  };

  const handleConfirmWithSideEffects = async (_inputValue) => {
    setActionError(null);

    const isApprove = actionType === "approved";
    const remarks = actionType === "rejected" ? "Rejected" : "Approved";

    try {
      if (
        isApprove &&
        formRef.current &&
        typeof formRef.current.saveDraft === "function"
      ) {
        await formRef.current.saveDraft();
      }

      await handleSubmit(remarks);
      await handleRefetch();
    } catch (e) {
      setActionError(getErrMsg(e));
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <EmptyState heading="Error" description={error?.message} />;

  return (
    <>
      <IconPageHeader
        heading={approvalType}
        description={approvalDesc}
        icon={Target}
      >
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefetch}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-gray-700 transition-all duration-200 group"
            disabled={isRefetching || loadingAgreement}
          >
            <RefreshCw
              className={`w-4 h-4 ${
                isRefetching || loadingAgreement ? "animate-spin" : ""
              }`}
            />
          </button>
        </div>
      </IconPageHeader>

      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <AgreementRequesterDetail data={data} refetch={refetch} />

          {actionError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {actionError}
            </div>
          ) : null}

          <div className="col-span-12 lg:col-span-8">
            {loadingAgreement ? (
              <LoadingSpinner />
            ) : agreement ? (
              <AgreementPlacementForm
                ref={formRef}
                active
                seed={agreement}
                showHeader
                hideSubmit
                hideSave
                status={agreement?.status}
                refetch={handleRefetch}
                showApprovalActions
                canTakeAction={canTakeAction}
                onApprove={handleApproveClick}
                onReject={handleRejectClick}
                approvalSubmitting={isSubmitting}
                activeApprovalType={
                  data?.approval_type?.code || data?.approval_type?.label || null
                }
              />
            ) : (
              <EmptyState heading="Agreement not found" description="" />
            )}
          </div>

          <div className="col-span-12">
            <Discussion
              title="Agreement Discussions"
              storeEndPoint={`/customer-hub/agreements/${agreementId}/discussion/`}
              getEndPoint={`/customer-hub/agreements/${agreementId}/discussions/`}
              users={mentionUsers}
            />
          </div>
        </div>
      </div>

      {selectedId && (
        <AlertModalPortal
          id="agreement-approval"
          isOpen={isModalOpen}
          type={getModalType(actionType)}
          title={getModalTitle(actionType)}
          message={getModalMessage(actionType)}
          btnTxt={getModalButtonText(actionType)}
          isSubmitting={isSubmitting}
          needInput={true}
          inputLabel="Remarks"
          onConfirm={handleConfirmWithSideEffects}
          onClose={setIsModalOpen}
        />
      )}
    </>
  );
};

export default AgreementApprovalDetail;
