export const DISCOUNT_ROUTES = {
  READ: {
    path: "/module/discount-card",
  },
};

export const MODULE_ROUTES = [
  {
    path:  DISCOUNT_ROUTES.READ.path,
    component: () =>
      import(`/src/modules/discount-card/components/DiscountCard`),

  },
];
