
package com.devflow.dto;

import lombok.Generated;

public class ClienteRequestDto {
   private String razaoSocial;
   private String cnpj;
   private String pessoaContato;

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
      } else if (!(o instanceof ClienteRequestDto)) {
         return false;
      } else {
         ClienteRequestDto other = (ClienteRequestDto)o;
         if (!other.canEqual(this)) {
            return false;
         } else {
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
      return other instanceof ClienteRequestDto;
   }

   @Generated
   public int hashCode() {
      int result = 1;
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
      String var10000 = this.getRazaoSocial();
      return "ClienteRequestDto(razaoSocial=" + var10000 + ", cnpj=" + this.getCnpj() + ", pessoaContato=" + this.getPessoaContato() + ")";
   }

   @Generated
   public ClienteRequestDto() {
   }

   @Generated
   public ClienteRequestDto(final String razaoSocial, final String cnpj, final String pessoaContato) {
      this.razaoSocial = razaoSocial;
      this.cnpj = cnpj;
      this.pessoaContato = pessoaContato;
   }
}