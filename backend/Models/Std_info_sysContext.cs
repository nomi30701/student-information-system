using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace student_information_system.Models;

public partial class Std_info_sysContext : DbContext
{
    public Std_info_sysContext(DbContextOptions<Std_info_sysContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Course> Course { get; set; }

    public virtual DbSet<Enrollment> Enrollment { get; set; }

    public virtual DbSet<EnrollmentStatus> EnrollmentStatus { get; set; }

    public virtual DbSet<InvitationCode> InvitationCode { get; set; }

    public virtual DbSet<InvitationCodeUsage> InvitationCodeUsage { get; set; }

    public virtual DbSet<Role> Role { get; set; }

    public virtual DbSet<User> User { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Course>(entity =>
        {
            entity.Property(e => e.CourseName).HasMaxLength(100);

            entity.HasOne(d => d.Teacher).WithMany(p => p.Course)
                .HasForeignKey(d => d.TeacherId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Course_User");
        });

        modelBuilder.Entity<Enrollment>(entity =>
        {
            entity.Property(e => e.EnrollmentDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.StatusId).HasDefaultValueSql("('Enrolled')");
            entity.Property(e => e.UpdatedDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.Course).WithMany(p => p.Enrollment)
                .HasForeignKey(d => d.CourseId)
                .HasConstraintName("FK_Enrollment_Course");

            entity.HasOne(d => d.Status).WithMany(p => p.Enrollment)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Enrollment_EnrollmentStatus");

            entity.HasOne(d => d.Student).WithMany(p => p.Enrollment)
                .HasForeignKey(d => d.StudentId)
                .HasConstraintName("FK_Enrollment_User");
        });

        modelBuilder.Entity<EnrollmentStatus>(entity =>
        {
            entity.HasKey(e => e.StatusId);

            entity.Property(e => e.StatusId).ValueGeneratedNever();
            entity.Property(e => e.StatusName).HasMaxLength(20);
        });

        modelBuilder.Entity<InvitationCode>(entity =>
        {
            entity.Property(e => e.Code).HasMaxLength(50);
            entity.Property(e => e.CreationDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ExpirationDate).HasColumnType("datetime");

            entity.HasOne(d => d.CreatorUser).WithMany(p => p.InvitationCode)
                .HasForeignKey(d => d.CreatorUserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_InvitationCode_User");

            entity.HasOne(d => d.Role).WithMany(p => p.InvitationCode)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_InvitationCode_Role");
        });

        modelBuilder.Entity<InvitationCodeUsage>(entity =>
        {
            entity.HasKey(e => e.UsageId);

            entity.Property(e => e.UsageDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.InvitationCode).WithMany(p => p.InvitationCodeUsage)
                .HasForeignKey(d => d.InvitationCodeId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_InvitationCodeUsage_InvitationCode");

            entity.HasOne(d => d.User).WithMany(p => p.InvitationCodeUsage)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK_InvitationCodeUsage_User");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.Property(e => e.RoleName).HasMaxLength(50);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.Property(e => e.CreateDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.PasswordHash).HasMaxLength(256);
            entity.Property(e => e.Username).HasMaxLength(50);

            entity.HasOne(d => d.Role).WithMany(p => p.User)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_User_Role");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
