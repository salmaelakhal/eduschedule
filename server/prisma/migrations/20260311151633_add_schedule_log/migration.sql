-- CreateTable
CREATE TABLE "ScheduleLog" (
    "id" SERIAL NOT NULL,
    "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "weekEnd" TIMESTAMP(3) NOT NULL,
    "totalCount" INTEGER NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "ScheduleLog_pkey" PRIMARY KEY ("id")
);
