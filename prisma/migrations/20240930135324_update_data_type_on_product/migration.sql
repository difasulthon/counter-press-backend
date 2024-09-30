/*
  Warnings:

  - Made the column `brandId` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `brandName` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_brandId_fkey";

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "brandId" SET NOT NULL,
ALTER COLUMN "brandName" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
