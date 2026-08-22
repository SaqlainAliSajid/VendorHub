"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getCatalog,
  getVendorProfile,
  getVendorReviews,
  submitReview,
} from "@/lib/api/vendorhub";

import type {
  CatalogProduct,
  Review,
} from "@/lib/api/types";

import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { ProductCard } from "./catalog-page";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardBody } from "./ui/card";
import { Modal } from "./ui/modal";
import { StarRating } from "./ui/star-rating";
import { TextAreaInput } from "./ui/input";

export function VendorProfilePage({
  id,
}: {
  id: string;
}) {
  const queryClient = useQueryClient();

  const [reviewOpen, setReviewOpen] =
    useState(false);

  const [rating, setRating] = useState(5);

  const [comment, setComment] =
    useState("");

  /*
   * Vendor profile
   */
  const vendorQuery = useQuery({
    queryKey: ["vendor-profile", id],
    queryFn: () => getVendorProfile(id),
    enabled: Boolean(id),
  });

  /*
   * Catalog
   *
   * getCatalog accepts an optional string,
   * while React Query passes a QueryFunctionContext.
   * Therefore we wrap getCatalog in a function.
   */
  const productsQuery = useQuery<CatalogProduct[]>({
    queryKey: ["catalog"],
    queryFn: () => getCatalog(),
  });

  /*
   * Only show products belonging to this vendor.
   */
  const products = (
    productsQuery.data ?? []
  ).filter(
    (product) => product.vendorId === id,
  );

  /*
   * Vendor reviews
   */
  const reviewsQuery = useQuery<Review[]>({
    queryKey: ["vendor-reviews", id],
    queryFn: () => getVendorReviews(id),
    enabled: Boolean(id),
  });

  /*
   * Submit review
   */
  const reviewMutation = useMutation({
    mutationFn: () =>
      submitReview(id, {
        rating,
        comment: comment.trim(),
      }),

    onSuccess: (review) => {
      /*
       * Optimistically update reviews list.
       */
      queryClient.setQueryData<Review[]>(
        ["vendor-reviews", id],
        (current = []) => [
          review,
          ...current,
        ],
      );

      /*
       * Update review count on vendor profile.
       */
      queryClient.setQueryData(
        ["vendor-profile", id],
        (
          current:
            | Awaited<
                ReturnType<
                  typeof getVendorProfile
                >
              >
            | undefined,
        ) =>
          current
            ? {
                ...current,
                reviewCount:
                  current.reviewCount + 1,
              }
            : current,
      );

      /*
       * Reset form.
       */
      setComment("");
      setRating(5);
      setReviewOpen(false);
    },
  });

  /*
   * Vendor loading state
   */
  if (vendorQuery.isLoading) {
    return (
      <div className="min-h-screen bg-canvas">
        <SiteHeader authenticated />

        <main className="page-shell py-10">
          <div className="animate-pulse space-y-5">
            <div className="h-48 rounded-2xl bg-slate-200" />

            <div className="h-36 rounded-2xl bg-slate-200" />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-72 rounded-2xl bg-slate-200"
                />
              ))}
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    );
  }

  /*
   * Vendor not found / API error
   */
  if (
    vendorQuery.isError ||
    !vendorQuery.data
  ) {
    return (
      <div className="min-h-screen bg-canvas">
        <SiteHeader authenticated />

        <main className="page-shell py-16 text-center">
          <h1 className="text-2xl font-semibold text-navy">
            Vendor not found
          </h1>

          <p className="mt-2 text-sm text-muted">
            We could not find the supplier you
            are looking for.
          </p>

          <Link
            href="/search"
            className="mt-4 inline-block font-semibold text-blue hover:underline"
          >
            Back to search
          </Link>
        </main>

        <SiteFooter />
      </div>
    );
  }

  const vendor = vendorQuery.data;

  const reviews =
    reviewsQuery.data ?? [];

  return (
    <div className="min-h-screen bg-canvas">
      <SiteHeader authenticated />

      <main className="page-shell py-9 sm:py-12">
        {/* =========================================
            VENDOR HEADER
        ========================================= */}
        <Card className="overflow-hidden">
          <div className="h-32 bg-gradient-to-br from-navy via-slate-800 to-blue-800 sm:h-40" />

          <CardBody className="p-5 sm:p-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-semibold tracking-tight text-navy sm:text-3xl">
                    {vendor.name}
                  </h1>

                  {vendor.verified && (
                    <Badge intent="success">
                      Verified
                    </Badge>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <StarRating
                    value={vendor.rating}
                    readOnly
                  />

                  <span className="text-sm font-medium text-muted">
                    {vendor.rating.toFixed(1)}{" "}
                    · {vendor.reviewCount} reviews
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                  <span>
                    {vendor.location}
                  </span>

                  <span>
                    {vendor.category}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {vendor.tags.map(
                    (tag) => (
                      <Badge key={tag}>
                        {tag}
                      </Badge>
                    ),
                  )}
                </div>
              </div>

              <Button
                type="button"
                onClick={() =>
                  setReviewOpen(true)
                }
              >
                Write a review
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* =========================================
            ABOUT
        ========================================= */}
        <section className="mt-8">
          <Card>
            <CardBody className="p-5 sm:p-7">
              <h2 className="text-xl font-semibold text-navy">
                About {vendor.name}
              </h2>

              <p className="mt-3 max-w-4xl text-sm leading-7 text-muted">
                {vendor.description}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">
                    Founded
                  </p>

                  <p className="mt-1 font-semibold text-navy">
                    {vendor.foundedYear}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">
                    Employees
                  </p>

                  <p className="mt-1 font-semibold text-navy">
                    {vendor.employeeRange}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </section>

        {/* =========================================
            PRODUCTS
        ========================================= */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold text-navy">
              Products
            </h2>

            <p className="mt-1 text-sm text-muted">
              Products currently listed by this
              supplier.
            </p>
          </div>

          {productsQuery.isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-72 animate-pulse rounded-2xl bg-slate-200"
                />
              ))}
            </div>
          ) : productsQuery.isError ? (
            <Card>
              <CardBody className="p-7 text-sm text-red-700">
                Unable to load this vendor's
                products. Please try again.
              </CardBody>
            </Card>
          ) : products.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardBody className="p-7 text-sm text-muted">
                No catalog products are listed
                for this vendor yet.
              </CardBody>
            </Card>
          )}
        </section>

        {/* =========================================
            CERTIFICATIONS
        ========================================= */}
        <section className="mt-10">
          <Card>
            <CardBody className="p-5 sm:p-7">
              <h2 className="text-xl font-semibold text-navy">
                Certifications
              </h2>

              {vendor.certifications
                .length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {vendor.certifications.map(
                    (cert) => (
                      <Badge
                        key={cert}
                        intent="success"
                      >
                        {cert}
                      </Badge>
                    ),
                  )}
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted">
                  No certifications listed.
                </p>
              )}
            </CardBody>
          </Card>
        </section>

        {/* =========================================
            REVIEWS
        ========================================= */}
        <section className="mt-10">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold text-navy">
              Reviews
            </h2>

            <p className="mt-1 text-sm text-muted">
              Feedback from verified buying
              teams.
            </p>
          </div>

          {reviewsQuery.isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-2xl bg-slate-200"
                />
              ))}
            </div>
          ) : reviewsQuery.isError ? (
            <Card>
              <CardBody className="p-7 text-sm text-red-700">
                Unable to load reviews. Please
                try again.
              </CardBody>
            </Card>
          ) : reviews.length ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardBody className="p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-navy">
                          {review.buyerName}
                        </p>

                        <div className="mt-2">
                          <StarRating
                            value={
                              review.rating
                            }
                            readOnly
                          />
                        </div>
                      </div>

                      <time
                        className="text-sm text-muted"
                        dateTime={
                          review.createdAt
                        }
                      >
                        {review.createdAt}
                      </time>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-muted">
                      {review.comment}
                    </p>
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardBody className="p-7 text-sm text-muted">
                No reviews yet. Be the first to
                review this supplier.
              </CardBody>
            </Card>
          )}
        </section>
      </main>

      <SiteFooter />

      {/* =========================================
          REVIEW MODAL
      ========================================= */}
      <Modal
        open={reviewOpen}
        onClose={() => {
          if (!reviewMutation.isPending) {
            setReviewOpen(false);
          }
        }}
        title="Write a review"
      >
        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-semibold text-ink">
              Your rating
            </p>

            <StarRating
              value={rating}
              onChange={setRating}
              readOnly={false}
            />
          </div>

          <TextAreaInput
            label="Review"
            value={comment}
            onChange={(event) =>
              setComment(
                event.target.value,
              )
            }
            rows={5}
            placeholder="Share your experience with this supplier..."
            required
          />

          {reviewMutation.isError && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              Unable to submit the review.
              Please try again.
            </p>
          )}

          <Button
            type="button"
            className="w-full"
            loading={
              reviewMutation.isPending
            }
            disabled={
              !comment.trim() ||
              reviewMutation.isPending
            }
            onClick={() =>
              reviewMutation.mutate()
            }
          >
            Submit review
          </Button>
        </div>
      </Modal>
    </div>
  );
}