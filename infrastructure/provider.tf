provider "aws" {
  region = var.region
  access_key = "ASIAUYXKYCIF6SU6KKPO"
  secret_key = "f415pbhMFAmoRH4iA5Oh58yScK1KQ6mz/P+f2RNh"
  token      = "IQoJb3JpZ2luX2VjEBwaCXVzLXdlc3QtMiJGMEQCIE2U8tGS6bYmhCgDqPiwHucbTfq7OTLJes9dd7+aZkpBAiAeVpcFK9H4ZNxcrv99x4FHZMs9SRAKCo6pQMg2UufxvSq8Agjk//////////8BEAEaDDMyNzk4MzU2NzM3MSIMZO8hkVEyJ5QXvzyBKpACE+wHanz09Pke8gBX3GuVHswUJixL/ZBYEC0qw3c6Mf88kdIHFbBC+2+Rd1/l8vmXBSVVWVti9t+2AsAkYuLVg2/Iqvlol97SJi1LFcs93e9Bkxd3wFtxBiuYig63NmnmEqeOiUz1sBJGFjyGgbLiS426C7Qvev5jrJ9VuHQZj2SI7JkDJG5oCti48N4M+tlLISUz7At7WeC1sQ7TVntY/IxYRcnyyCLLa2OTFq2Cxj8LIqOZtzdn77puF4yIMlbuBv6ni1J43oOK99DKQ8AFxe5TxprsAgz6LnCtErfQRDQZJPef/Wt41CKGPB9YKMAHSUR6lbFmGBcP3CMEweXuqfXdavx2MtTzrMY6W67NRI4w+LD8zwY6ngFvTQ6TlDRUnseMpBnlsadUGNSCnL3xE+pdgPkEla9Q07nzRUrmXJJEOsO5zr/+uvvRCMAB5bRHpproezqKQfOZOdCPsVXtO8+5fkg81Nb1QJnouD1MUqVPArTSG6WqctFpzCM1p3eir2CwTD7rgRsF+vxb8Bg4/ObZCtepgMqiGtKSpxGS1tLklnSKjqq8taFGEAA8aaP0/PzRT3doqA=="
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}
