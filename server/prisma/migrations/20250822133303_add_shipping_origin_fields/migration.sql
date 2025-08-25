/*
  Warnings:

  - Added the required column `shippingOriginId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingOriginName` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "shippingOriginId" TEXT NOT NULL,
ADD COLUMN     "shippingOriginName" TEXT NOT NULL;
