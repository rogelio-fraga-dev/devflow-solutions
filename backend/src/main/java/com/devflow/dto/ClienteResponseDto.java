package com.devflow.dto;

import lombok.Generated;

public class ClienteResponseDto {
   private Long id;
   private String razaoSocial;
   private String cnpj;
   private String pessoaContato;

   @Generated
   public Long getId() {
      return this.id;
   }

   @Generated
   public String getRazaoSocial() {
      return this.razaoSocial;
   }

   @Generated
   public String getCnpj() {
      return this.cnpj;
   }

   @Generated
   public String getPessoaContato() {
      return this.pessoaContato;
   }

   @Generated
   public void setId(final Long id) {
      this.id = id;
   }

   @Generated
   public void setRazaoSocial(final String razaoSocial) {
      this.razaoSocial = razaoSocial;
   }

   @Generated
   public void setCnpj(final String cnpj) {
      this.cnpj = cnpj;
   }

   @Generated
   public void setPessoaContato(final String pessoaContato) {
      this.pessoaContato = pessoaContato;
   }

   @Generated
   public boolean equals(final Object o) {
      if (o == this) {
         return true;
      } else if (!(o instanceof ClienteResponseDto)) {
         return false;
      } else {
         ClienteResponseDto other = (ClienteResponseDto)o;
         if (!other.canEqual(this)) {
            return false;
         } else {
            Object this$id = this.getId();
            Object other$id = other.getId();
            if (this$id == null) {
               if (other$id != null) {
                  return false;
               }
            } else if (!this$id.equals(other$id)) {
               return false;
            }

            Object this$razaoSocial = this.getRazaoSocial();
            Object other$razaoSocial = other.getRazaoSocial();
            if (this$razaoSocial == null) {
               if (other$razaoSocial != null) {
                  return false;
               }
            } else if (!this$razaoSocial.equals(other$razaoSocial)) {
               return false;
            }

            Object this$cnpj = this.getCnpj();
            Object other$cnpj = other.getCnpj();
            if (this$cnpj == null) {
               if (other$cnpj != null) {
                  return false;
               }
            } else if (!this$cnpj.equals(other$cnpj)) {
               return false;
            }

            Object this$pessoaContato = this.getPessoaContato();
            Object other$pessoaContato = other.getPessoaContato();
            if (this$pessoaContato == null) {
               if (other$pessoaContato != null) {
                  return false;
               }
            } else if (!this$pessoaContato.equals(other$pessoaContato)) {
               return false;
            }

            return true;
         }
      }
   }

   @Generated
   protected boolean canEqual(final Object other) {
      return other instanceof ClienteResponseDto;
   }

   @Generated
   public int hashCode() {
      int result = 1;
      Object $id = this.getId();
      result = result * 59 + ($id == null ? 43 : $id.hashCode());
      Object $razaoSocial = this.getRazaoSocial();
      result = result * 59 + ($razaoSocial == null ? 43 : $razaoSocial.hashCode());
      Object $cnpj = this.getCnpj();
      result = result * 59 + ($cnpj == null ? 43 : $cnpj.hashCode());
      Object $pessoaContato = this.getPessoaContato();
      result = result * 59 + ($pessoaContato == null ? 43 : $pessoaContato.hashCode());
      return result;
   }

   @Generated
   public String toString() {
      String var10000 = String.valueOf(this.getId());
      return "ClienteResponseDto(id=" + var10000 + ", razaoSocial=" + this.getRazaoSocial() + ", cnpj=" + this.getCnpj() + ", pessoaContato=" + this.getPessoaContato() + ")";
   }

   @Generated
   public ClienteResponseDto() {
   }

   @Generated
   public ClienteResponseDto(final Long id, final String razaoSocial, final String cnpj, final String pessoaContato) {
      this.id = id;
      this.razaoSocial = razaoSocial;
      this.cnpj = cnpj;
      this.pessoaContato = pessoaContato;
   }
}
